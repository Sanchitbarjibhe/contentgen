import type { Metadata } from "next";
import { SITE } from "./config";

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
};

export function buildMetadata({
  title,
  description,
  path,
  image,
  noindex,
  type = "website",
}: BuildMetadataInput): Metadata {
  const normalizedPath =
    path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  const url = `${SITE.url}${normalizedPath}`;
  const imageUrl = image ?? SITE.defaultOg;
  const og = /^https?:\/\//i.test(imageUrl)
    ? imageUrl
    : `${SITE.url}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  const fullTitle =
    title.length > 58 ? `${title.slice(0, 57).trimEnd()}…` : title;
  const desc =
    description.length > 155
      ? `${description.slice(0, 154).trimEnd()}…`
      : description;

  return {
    metadataBase: new URL(SITE.url),
    title: fullTitle,
    description: desc,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE.name,
      type,
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [og],
      site: SITE.twitter,
    },
  };
}
