"use client";

import { useState } from "react";
import { getSafeExternalUrl } from "@/lib/marketplace-types";

interface BusinessListingLogoProps {
  name: string;
  logoUrl: string | null;
  websiteUrl: string;
  initials: string;
  accent: string;
}

export default function BusinessListingLogo({
  name,
  logoUrl,
  websiteUrl,
  initials,
  accent,
}: BusinessListingLogoProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const safeLogoUrl = getSafeExternalUrl(logoUrl);
  const safeWebsiteUrl = getSafeExternalUrl(websiteUrl);
  const faviconUrl = safeWebsiteUrl
    ? `https://www.google.com/s2/favicons?${new URLSearchParams({
        domain: new URL(safeWebsiteUrl).hostname,
        sz: "128",
      })}`
    : null;
  const imageUrls = [safeLogoUrl, faviconUrl].filter(
    (url): url is string => url !== null,
  );
  const imageUrl = imageUrls[imageIndex];
  const fallbackInitial =
    initials.trim().charAt(0) || name.trim().charAt(0).toUpperCase() || "?";

  return imageUrl ? (
    <img
      alt={`${name} logo`}
      className={`size-10 shrink-0 rounded-xl bg-white object-contain p-1 shadow-lg ${accent}`}
      height={40}
      loading="lazy"
      onError={() =>
        setImageIndex((current) => Math.min(current + 1, imageUrls.length))
      }
      src={imageUrl}
      width={40}
    />
  ) : (
    <span
      aria-hidden="true"
      className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-black text-white shadow-lg ${accent}`}
    >
      {fallbackInitial}
    </span>
  );
}
