import { nicheResources } from "../data/niche-resources";
import { resources } from "../data/resources";
import { prisma } from "../lib/prisma";
import { toCreatorResourceData } from "../lib/creator-resources";

const allResources = [...resources, ...nicheResources];

export async function seedCreatorResources() {
  for (const resource of allResources) {
    const data = toCreatorResourceData(resource);
    await prisma.creatorResource.upsert({
      where: { slug: data.slug },
      create: data,
      update: {
        title: data.title,
        category: data.category,
        niche: data.niche,
        summary: data.summary,
        content: data.content,
        platforms: data.platforms,
      },
    });
  }

  console.info(`Upserted ${allResources.length} creator resources.`);
}
