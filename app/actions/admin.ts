"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-access";

export async function setBusinessListingApproval(id: string, isApproved: boolean) {
  await requireAdmin();
  const listingId = id.trim();
  if (!listingId) throw new Error("A listing ID is required.");

  await prisma.businessListing.update({
    where: { id: listingId },
    data: { isApproved },
  });
  revalidatePath("/marketplace");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteBusinessListing(id: string) {
  await requireAdmin();
  const listingId = id.trim();
  if (!listingId) throw new Error("A listing ID is required.");

  await prisma.businessListing.delete({ where: { id: listingId } });
  revalidatePath("/marketplace");
  revalidatePath("/admin");
  return { ok: true };
}
