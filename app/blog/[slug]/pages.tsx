import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
    // Promise Await करा
    const { slug } = await params;

    const filePath = path.join(process.cwd(), "content/blogs", `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
        notFound();
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return (
        <article className="max-w-3xl mx-auto p-6 text-white pt-16">
            <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
            <p className="text-zinc-400 text-sm mb-8">{data.date}</p>
            <div className="prose prose-invert max-w-none">
                {content}
            </div>
        </article>
    );
}