import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { marked } from "marked"; // 👈 marked इंपोर्ट करा

interface BlogProps {
    params: Promise<{ slug: string }>;
}

function getBlogPost(slug: string) {
    let blogDir = path.resolve(process.cwd(), "content", "blogs");

    if (!fs.existsSync(blogDir)) {
        blogDir = path.resolve(process.cwd(), "src", "content", "blogs");
    }

    if (!fs.existsSync(blogDir)) {
        return null;
    }

    const allFiles = fs.readdirSync(blogDir);

    const matchedFile = allFiles.find((file) => {
        const fileSlug = file.replace(/\.(mdx?|md|txt)$/i, "");
        return fileSlug.toLowerCase() === slug.toLowerCase();
    });

    if (!matchedFile) {
        return null;
    }

    const filePath = path.join(blogDir, matchedFile);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return matter(fileContent);
}

export async function generateMetadata({ params }: BlogProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPost(slug);

    if (!post) {
        return {};
    }

    const title = `${post.data.title || slug} | HookTos AI`;
    const description = post.data.description || "Read the latest from HookTos AI.";
    const canonical = `https://www.hooktos.com/blog/${slug}`;

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

    if (!post) {
        return notFound();
    }

    const { data, content } = post;

    // Markdown ला HTML मध्ये रूपांतरित करा
    const htmlContent = marked.parse(content);

    return (
        <main className="max-w-3xl mx-auto p-6 min-h-screen pt-24 text-zinc-300">
            <div className="mb-8 border-b border-zinc-800 pb-6">
                <h1 className="text-4xl font-extrabold text-white mb-3">
                    {data.title || slug}
                </h1>
                {data.date && <p className="text-sm text-zinc-500">{data.date}</p>}
            </div>

            <article
                className="prose prose-invert max-w-none leading-relaxed prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </main>
    );
}