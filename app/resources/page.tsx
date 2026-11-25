import type { Metadata } from "next";
import ResourceHub from "@/components/resources/ResourceHub";
import { resources } from "@/data/resources";
import { nicheResources } from "@/data/niche-resources";
import { buildMetadata } from "@/lib/seo/metadata";
import { collectionPageSchema } from "@/lib/seo/schema";
import JsonLd from "@/components/seo/JsonLd";

const allResources = [...resources, ...nicheResources];
const pageTitle = "Creator Resource Hub & Swipe Files";
const pageDescription =
  "Browse proven viral hook swipe files, ChatGPT prompt packs, creator checklists, and ready-to-use short-form script templates.";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: pageTitle,
    description: pageDescription,
    path: "/resources",
  });
}

export default function ResourcesPage() {
  const structuredData = collectionPageSchema({
    name: pageTitle,
    description: pageDescription,
    url: "/resources",
    items: allResources.map((resource) => ({
      name: resource.title,
      url: `/resources/${resource.category}/${resource.slug}`,
    })),
  });

  return (
    <>
      <JsonLd data={structuredData} />
      <ResourceHub resources={allResources} />
    </>
  );
}
