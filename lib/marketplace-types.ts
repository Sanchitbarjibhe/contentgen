export interface BusinessListingItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  tag: string;
  websiteUrl: string;
  logoUrl: string | null;
}

export interface BillboardSlot {
  id: string;
  title: string;
  category: string;
  tier: string;
  pricePerWeek: number;
  views: number;
  clicks: number;
  imageUrl: string | null;
  websiteUrl: string | null;
}

export function getSafeExternalUrl(value: string | null | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    const isWebProtocol = url.protocol === "http:" || url.protocol === "https:";
    const isExampleDomain =
      url.hostname === "example" || url.hostname.endsWith(".example");

    return isWebProtocol && !isExampleDomain ? url.toString() : null;
  } catch {
    return null;
  }
}
