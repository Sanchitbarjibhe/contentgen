import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";
import { HOOK_TYPES, PLATFORMS, getHookPage } from "@/lib/hook-pages";

type PageProps = {
  params: Promise<{ platform: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return PLATFORMS.map((platform) => ({ platform: platform.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { platform: slug } = await params;
  const platform = PLATFORMS.find((item) => item.slug === slug);
  if (!platform) return buildMetadata({ title: "Hooks", description: "Hook guides.", path: "/hooks" });

  return buildMetadata({
    title: `Viral Hooks for ${platform.name} (2026)`,
    description: `Explore curiosity, storytelling, question, and problem-solution hook guides for ${platform.name}.`,
    path: `/hooks/${platform.slug}`,
  });
}

export default async function HookPlatformPage({ params }: PageProps) {
  const { platform: slug } = await params;
  const platform = PLATFORMS.find((item) => item.slug === slug);
  if (!platform) notFound();

  const availableTypes = HOOK_TYPES.filter((hookType) =>
    Boolean(getHookPage(platform.slug, hookType.slug)),
  );

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-16 text-slate-100 sm:px-6">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Hooks", url: "/hooks" },
            { name: platform.name, url: `/hooks/${platform.slug}` },
          ]),
          itemListSchema(
            `${platform.name} hook guides`,
            availableTypes.map((hookType) => ({
              name: `${hookType.name} hooks for ${platform.name}`,
              url: `/hooks/${platform.slug}/${hookType.slug}`,
            })),
          ),
        ]}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
        <Link className="hover:text-white" href="/">Home</Link>
        <span className="px-2">/</span>
        <Link className="hover:text-white" href="/hooks">Hooks</Link>
        <span className="px-2">/</span>
        <span className="text-slate-200">{platform.name}</span>
      </nav>
      <header className="mt-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
          Viral hooks for {platform.name}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          Choose a proven opening style for {platform.format}.
        </p>
      </header>
      <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {availableTypes.map((hookType) => (
          <Link
            key={hookType.slug}
            href={`/hooks/${platform.slug}/${hookType.slug}`}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-purple-500/50"
          >
            <h2 className="font-bold text-white">{hookType.name} hooks</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {hookType.description}
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}
