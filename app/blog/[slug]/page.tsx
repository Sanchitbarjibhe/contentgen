import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { marked } from "marked";

interface BlogProps {
    params: Promise<{ slug: string }>;
}

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

function getBlogPost(slug: string) {
    const matchedFile = fs.readdirSync(path.join(process.cwd(), "content", "blogs")).find((file) =>
        normalizeSlug(getFileSlug(file)) === normalizeSlug(slug)
    );
    if (!matchedFile) return null;

    const filePath = path.join(process.cwd(), "content", "blogs", matchedFile);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return matter(fileContent);
}

export function generateStaticParams() {
    return fs.readdirSync(path.join(process.cwd(), "content", "blogs"))
        .filter((file) => /(?:\.(?:md|mdx))+$/i.test(file))
        .map((file) => ({ slug: normalizeSlug(getFileSlug(file)) }));
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
    const rawTitle = post.data.title || normalizedSlug.replace(/-/g, " ");
    const title = `${rawTitle} | HookTos AI`;
    const description = post.data.description || `Learn more about ${rawTitle} on HookTos AI - The ultimate viral hook & content generator tool.`;
    const canonical = `https://www.hooktos.com/blog/${normalizedSlug}`;

    return {
        title: { absolute: title },
        description,
        alternates: { canonical },
        openGraph: {
            type: "article",
            title,
            description,
            url: canonical,
            siteName: "HookTos AI",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
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

    const { data, content } = post;

    // Async handling for marked parser safety
    const htmlContent = await marked.parse(content);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <article className="max-w-4xl mx-auto px-6 py-12">
                <header className="mb-10 text-center space-y-4">
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                        {data.title || normalizedSlug.replace(/-/g, " ")}
                    </h1>
                    {data.date && <p className="text-sm text-purple-400 font-medium">{data.date}</p>}
                </header>

                <div
                    className="prose prose-invert prose-purple lg:prose-lg max-w-none
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
            </article>
        </main>
    );
}