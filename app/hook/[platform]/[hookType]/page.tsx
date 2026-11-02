import { notFound, permanentRedirect } from "next/navigation";
import {
  HOOK_PAGES,
  getHookPage,
} from "@/lib/hook-pages";

type LegacyPageProps = {
  params: Promise<{ platform: string; hookType: string }>;
};

function getCanonicalPlatformSlug(platformSlug: string): string {
  return platformSlug === "instagram" ? "instagram-reels" : platformSlug;
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{
  platform: string;
  hookType: string;
}> {
  return HOOK_PAGES.map(({ platform, hookType }) => ({
    platform: platform.slug === "instagram-reels" ? "instagram" : platform.slug,
    hookType: hookType.slug,
  }));
}

export default async function LegacyHookPage({ params }: LegacyPageProps) {
  const { platform, hookType } = await params;
  const canonicalPlatform = getCanonicalPlatformSlug(platform);

  if (!getHookPage(canonicalPlatform, hookType)) {
    notFound();
  }

  permanentRedirect(`/hooks/${canonicalPlatform}/${hookType}`);
}
