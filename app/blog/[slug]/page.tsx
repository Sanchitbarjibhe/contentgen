import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { marked } from "marked"; // 👈 marked इंपोर्ट करा

interface BlogProps {
    params: Promise<{ slug: string }>;
}

export default async function SingleBlogPost({ params }: BlogProps) {
    const { slug } = await params;

    let blogDir = path.resolve(process.cwd(), "content", "blogs");

    if (!fs.existsSync(blogDir)) {
        blogDir = path.resolve(process.cwd(), "src", "content", "blogs");
    }

    if (!fs.existsSync(blogDir)) {
        return notFound();
    }

    const allFiles = fs.readdirSync(blogDir);

    const matchedFile = allFiles.find((file) => {
        const fileSlug = file.replace(/\.(mdx?|md|txt)$/i, "");
        return fileSlug.toLowerCase() === slug.toLowerCase();
    });

    if (!matchedFile) {
        return notFound();
    }

    const filePath = path.join(blogDir, matchedFile);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

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

            {/* 👈 dangerouslySetInnerHTML वापरून HTML रेंडर करा */}
            <article
                className="prose prose-invert max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </main>
    );
}