import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

export default function BlogListingPage() {
    const blogDir = path.resolve(".", "content/blogs");

    if (!fs.existsSync(blogDir)) {
        // जर फोल्डर नसेल, तर ते ऑटोमॅटिक तयार करा
        fs.mkdirSync(blogDir, { recursive: true });
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
                {posts.length === 0 ? (
                    // जर एकही ब्लॉग सापडला नाही तर हा मेसेज दिसेल
                    <div className="text-center p-12 border border-zinc-800 rounded-xl bg-zinc-900/20 text-zinc-500">
                        No blog posts found. Please ensure your .mdx files are inside the 'content/blogs' folder with correct frontmatter.
                    </div>
                ) : (
                    // जर ब्लॉग्स असतील तर ते मॅप होतील
                    posts.map((post: any) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            prefetch={false} // <-- हे जोडल्यामुळे बॅकग्राउंडला चुकीचा डेटा प्रीफेच होणार नाही

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
                    ))
                )}
            </div>

        </main>
    );
}