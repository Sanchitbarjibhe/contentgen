import { SITE } from "./config";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    alternateName: ["HookTos", "HookTos AI"],
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/android-chrome-512x512.png`,
      width: 512,
      height: 512,
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: "en",
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.url}`,
    })),
  };
}

export function articleSchema(article: {
  headline: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  description?: string;
  image?: string;
}) {
  const url = `${SITE.url}${article.url}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.headline,
    description: article.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    image: article.image ? `${SITE.url}${article.image}` : `${SITE.url}/opengraph-image.png`,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

export function softwareAppSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE.url}/hooks#software`,
    name: "HookTos AI Viral Hook Generator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${SITE.url}/hooks`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      url: `${SITE.url}/hooks`,
    },
  };
}

export function itemListSchema(
  name: string,
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.url}`,
    })),
  };
}
