import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { marked, type Tokens } from "marked";
import JsonLd from "@/components/JsonLd";

interface BlogProps {
    params: Promise<{ slug: string }>;
}

interface BlogFile {
    filePath: string;
    slug: string;
}

interface BlogPost {
    data: Record<string, unknown>;
    content: string;
    slug: string;
    publishedDate: string;
}

interface FaqItem {
    question: string;
    answer: string;
}

const BLOG_DIRECTORIES = [
    path.join(process.cwd(), "content", "blogs"),
    path.join(process.cwd(), "content", "blog"),
    path.join(process.cwd(), "app", "blog"),
];

function normalizeSlug(slug: string) {
    let decodedSlug = slug;
    try {
        decodedSlug = decodeURIComponent(slug);
    } catch (error) {
        if (!(error instanceof URIError)) throw error;
    }

    return decodedSlug.trim().replace(/_/g, "-").replace(/-+/g, "-").toLowerCase();
}

function getFileSlug(fileName: string) {
    return fileName.replace(/(?:\.(?:md|mdx))+$/i, "");
}

function getBlogFiles(directory: string): BlogFile[] {
    if (!fs.existsSync(directory)) return [];

    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const filePath = path.join(directory, entry.name);
        if (entry.isDirectory()) return getBlogFiles(filePath);
        if (!entry.isFile() || !/(?:\.(?:md|mdx))+$/i.test(entry.name) || entry.name.startsWith("_")) {
            return [];
        }

        return [{ filePath, slug: normalizeSlug(getFileSlug(entry.name)) }];
    });
}

function getAllBlogFiles(): BlogFile[] {
    return BLOG_DIRECTORIES.flatMap(getBlogFiles);
}

function getBlogPostFromFile(file: BlogFile): BlogPost | null {
    const parsed = matter(fs.readFileSync(file.filePath, "utf-8"));
    if (parsed.data.draft === true || parsed.data.draft === "true") return null;

    const fileStats = fs.statSync(file.filePath);
    const publishedDate = toDateString(
        parsed.data.publishedAt ?? parsed.data.date,
        fileStats.birthtime || fileStats.mtime
    );

    return {
        data: parsed.data as Record<string, unknown>,
        content: parsed.content,
        slug: file.slug,
        publishedDate,
    };
}

function getBlogPost(slug: string): BlogPost | null {
    const matchedFile = getAllBlogFiles().find((file) => file.slug === normalizeSlug(slug));
    return matchedFile ? getBlogPostFromFile(matchedFile) : null;
}

function toDateString(value: unknown, fallback: Date): string {
    const date = value instanceof Date ? value : typeof value === "string" ? new Date(value) : fallback;
    return Number.isNaN(date.getTime()) ? fallback.toISOString() : date.toISOString();
}

function getString(value: unknown): string | undefined {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getKeywords(value: unknown): string[] {
    const keywords = Array.isArray(value)
        ? value.filter((keyword): keyword is string => typeof keyword === "string")
        : typeof value === "string"
            ? value.split(",")
            : [];
    return keywords.map((keyword) => keyword.trim()).filter(Boolean);
}

function toPlainText(markdown: string): string {
    return markdown
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/<[^>]+>/g, " ")
        .replace(/^\s{0,3}#{1,6}\s+/gm, "")
        .replace(/^\s*(?:[-*+]|\d+[.)])\s+/gm, "")
        .replace(/[*_~>|]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function getDescription(content: string): string {
    return toPlainText(content).slice(0, 155).trim();
}

function getSections(content: string): { heading: string; content: string }[] {
    const headings = [...content.matchAll(/^##\s+(.+)\s*$/gm)];
    return headings.map((heading, index) => {
        const start = (heading.index ?? 0) + heading[0].length;
        const end = headings[index + 1]?.index ?? content.length;
        return { heading: heading[1].trim(), content: content.slice(start, end) };
    });
}

function getPrimaryKeyword(keywords: string[], title: string, slug: string): string {
    if (keywords[0]) return keywords[0];

    const stopWords = new Set(["a", "an", "and", "for", "how", "in", "of", "on", "the", "to", "with"]);
    const words = (title || slug.replace(/-/g, " "))
        .replace(/[^\p{L}\p{N}\s-]/gu, " ")
        .split(/\s+/)
        .filter((word) => word && !stopWords.has(word.toLowerCase()));
    return words.slice(0, 3).join(" ") || title;
}

function getFaqItems(content: string, title: string): FaqItem[] {
    const items = getSections(content)
        .filter((section) => !/frequently asked questions|^faq$/i.test(section.heading))
        .flatMap((section) => {
            const heading = toPlainText(section.heading);
            const text = toPlainText(section.content);
            const sentences = text.match(/[^.!?]+[.!?]+(?:["')\]]+)?/g)?.map((sentence) => sentence.trim()) ?? [];
            if (sentences.length < 2) return [];

            return [{
                question: heading.endsWith("?") ? heading : `What should you know about ${heading}?`,
                answer: sentences.slice(0, 2).join(" "),
            }];
        }).slice(0, 3);

    if (items.length) return items;

    const sentences = toPlainText(content).match(/[^.!?]+[.!?]+(?:["')\]]+)?/g)?.map((sentence) => sentence.trim()) ?? [];
    if (sentences.length < 2) return [];
    return [{
        question: `What is ${title} about?`,
        answer: sentences.slice(0, 2).join(" "),
    }];
}

function getHowToSteps(content: string): { name: string; text: string }[] {
    const orderedList = marked.lexer(content).find(
        (token): token is Tokens.List => token.type === "list" && token.ordered
    );
    if (orderedList) {
        const listSteps = orderedList.items.flatMap((item) => {
            const text = toPlainText(item.text);
            if (!text) return [];
            return [{ name: text.split(/[.!?]/, 1)[0].slice(0, 100), text }];
        });
        if (listSteps.length) return listSteps;
    }

    return getSections(content)
        .filter((section) => !/frequently asked questions|^faq$/i.test(section.heading))
        .flatMap((section) => {
            const text = toPlainText(section.content);
            if (!text) return [];
            return [{ name: toPlainText(section.heading), text }];
        })
        .slice(0, 5);
}

function normalizeRenderedHeadings(html: string): string {
    let hasSectionHeading = false;
    return html.replace(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi, (_match, rawLevel: string, attributes: string, text: string) => {
        const sourceLevel = Number(rawLevel);
        const level = sourceLevel <= 2 || !hasSectionHeading ? 2 : 3;
        if (level === 2) hasSectionHeading = true;
        return `<h${level}${attributes}>${text}</h${level}>`;
    });
}

function absoluteUrl(value: string): string {
    return /^https?:\/\//i.test(value) ? value : `https://www.hooktos.com${value.startsWith("/") ? "" : "/"}${value}`;
}

export function generateStaticParams() {
    return getAllBlogFiles().flatMap((file) => getBlogPostFromFile(file) ? [{ slug: file.slug }] : []);
}

export async function generateMetadata({ params }: BlogProps): Promise<Metadata> {
    const { slug } = await params;
    const normalizedSlug = normalizeSlug(slug);
    const post = getBlogPost(slug);

    if (!post) {
        return {
            title: "Blog Post Not Found | HookTos AI",
        };
    }

    // Dynamic Title & Description Optimization
    const rawTitle = getString(post.data.title) || normalizedSlug.replace(/-/g, " ");
    const title = `${rawTitle} | HookTos AI`;
    const description = getString(post.data.description) || getDescription(post.content);
    const author = getString(post.data.author) || "HookTos AI Team";
    const keywords = getKeywords(post.data.keywords);
    const publishedDate = post.publishedDate;
    const modifiedDate = toDateString(post.data.updated, new Date(publishedDate));
    const canonical = `https://www.hooktos.com/blog/${normalizedSlug}`;
    const cover = getString(post.data.cover) || getString(post.data.image);
    const images = [absoluteUrl(cover || "/opengraph-image.png")];

    return {
        title: { absolute: title },
        description,
        keywords: keywords.length ? keywords : [getPrimaryKeyword([], rawTitle, normalizedSlug)],
        authors: [{ name: author }],
        alternates: { canonical },
        openGraph: {
            type: "article",
            title,
            description,
            url: canonical,
            siteName: "HookTos AI",
            authors: [author],
            publishedTime: publishedDate,
            modifiedTime: modifiedDate,
            images,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images,
        },
    };
}

export default async function SingleBlogPost({ params }: BlogProps) {
    const { slug } = await params;
    const post = getBlogPost(slug);
    const normalizedSlug = normalizeSlug(slug);

    if (!post) {
        return notFound();
    }

    const { data, content, publishedDate } = post;
    const rawTitle = getString(data.title) || normalizedSlug.replace(/-/g, " ");
    const keywords = getKeywords(data.keywords);
    const primaryKeyword = getPrimaryKeyword(keywords, rawTitle, normalizedSlug);
    const displayTitle = rawTitle.toLowerCase().includes(primaryKeyword.toLowerCase())
        ? rawTitle
        : `${rawTitle} — ${primaryKeyword}`;
    const author = getString(data.author) || "HookTos AI Team";
    const description = getString(data.description) || getDescription(content);
    const cover = getString(data.cover) || getString(data.image);
    const howToSteps = getHowToSteps(content);
    const modifiedDate = toDateString(data.updated, new Date(publishedDate));
    const canonical = `https://www.hooktos.com/blog/${normalizedSlug}`;
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${canonical}#article`,
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        headline: displayTitle,
        description,
        datePublished: publishedDate,
        dateModified: modifiedDate,
        author: {
            "@type": /team|studio|agency|inc\.?|llc/i.test(author) ? "Organization" : "Person",
            name: author,
        },
        publisher: { "@type": "Organization", name: "HookTos AI" },
        keywords: keywords.length ? keywords : [primaryKeyword],
        inLanguage: "en",
        image: absoluteUrl(cover || "/opengraph-image.png"),
    };
    const schema = [
        articleSchema,
        {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: `How to apply the guidance in ${rawTitle}`,
            description,
            inLanguage: "en",
            step: howToSteps.map((step, index) => ({
                "@type": "HowToStep",
                position: index + 1,
                name: step.name,
                text: step.text,
            })),
        },
    ];

    const parsedHtml = await marked.parse(content, { gfm: true });
    const htmlWithoutInlineSchema = parsedHtml.replace(
        /<script\b(?=[^>]*type=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi,
        ""
    );
    const htmlWithoutSourceTitle = htmlWithoutInlineSchema.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, "");
    const htmlContent = normalizeRenderedHeadings(htmlWithoutSourceTitle);
    const bodyText = toPlainText(content).toLowerCase();
    const firstHundredWords = bodyText.split(/\s+/).slice(0, 100).join(" ");
    const needsKeywordIntroduction = !firstHundredWords.includes(primaryKeyword.toLowerCase());
    const faqItems = getFaqItems(content, rawTitle);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <article className="max-w-4xl mx-auto px-6 py-12">
                <header className="mb-10 text-center space-y-4">
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">{displayTitle}</h1>
                    <time dateTime={publishedDate} className="text-sm text-purple-400 font-medium">{publishedDate.slice(0, 10)}</time>
                </header>

                {needsKeywordIntroduction && (
                    <p className="mb-6 text-slate-300">
                        This guide covers {primaryKeyword} with practical examples and advice you can apply.
                    </p>
                )}
                <JsonLd data={schema} />
                <div className="prose prose-invert prose-purple lg:prose-lg max-w-none">
                    <div
                        className="
                        prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2
                        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                        prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
                        prose-a:text-purple-400 prose-a:font-semibold prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-purple-300
                        prose-strong:text-white prose-strong:font-bold
                        prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-ul:space-y-2
                        prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6 prose-ol:space-y-2
                        prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-400"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                    {faqItems.length > 0 && (
                        <section aria-labelledby="faq-title">
                            <h2 id="faq-title">Frequently Asked Questions</h2>
                            {faqItems.map((item) => (
                                <div key={item.question}>
                                    <h3>{item.question}</h3>
                                    <p>{item.answer}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </article>
        </main>
    );
}