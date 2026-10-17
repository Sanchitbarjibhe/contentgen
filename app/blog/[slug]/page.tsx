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
            <article className="max-w-3xl mx-auto px-6 py-12">
                <div className="mb-8 border-b border-slate-800 pb-6">
                    <h1 className="text-4xl font-extrabold text-slate-100 mb-3 capitalize">
                        {data.title || normalizedSlug.replace(/-/g, " ")}
                    </h1>
                    {data.date && <p className="text-sm text-slate-400">{data.date}</p>}
                </div>

                <div
                    className="prose prose-invert prose-purple lg:prose-lg max-w-none prose-a:no-underline hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </article>
        </main>
    );
}