import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

export default async function BlogListingPage() {
    const blogDir = path.join(process.cwd(), "content/blogs");

    if (!fs.existsSync(blogDir)) {
        return (
            <main className="max-w-4xl mx-auto p-6 text-center text-white min-h-screen pt-20">
                <h1 className="text-3xl font-bold mb-4">Blog</h1>
                <p className="text-zinc-400">No blog posts found yet.</p>
            </main>
        );
    }

    const files = fs.readdirSync(blogDir);

    const posts = files
        .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
        .map((filename) => {
            // 1. Extension काढू न योग्य slug बनवा
            const slug = filename.replace(/\.mdx?$/, "");

            const filePath = path.join(blogDir, filename);
            const fileContent = fs.readFileSync(filePath, "utf-8");

            // 2. Frontmatter Parse करा
            const { data } = matter(fileContent);

            return {
                slug,
                data,
            };
        });

    return (
        <main className="max-w-4xl mx-auto p-6 min-h-screen pt-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-3">HookCraft AI Blog</h1>
                <p className="text-zinc-400 text-sm">
                    Latest strategies, guides, and tips for creating viral short-form content.
                </p>
            </div>

            <div className="grid gap-6">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50 hover:border-indigo-500/50 hover:bg-zinc-900 transition block group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition">
                                {post.data.title || post.slug}
                            </h2>
                            {post.data.date && (
                                <span className="text-xs text-zinc-500">{post.data.date}</span>
                            )}
                        </div>
                        <p className="text-zinc-400 text-sm">{post.data.description}</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}