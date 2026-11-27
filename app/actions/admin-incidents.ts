"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-access";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function createAdminIncident(input: unknown) {
  await requireAdmin();
  if (!isRecord(input)) throw new Error("Incident details are required.");

  const title =
    typeof input.title === "string" ? input.title.trim().slice(0, 120) : "";
  const details =
    typeof input.details === "string"
      ? input.details.trim().slice(0, 2000)
      : "";
  if (!title) throw new Error("Enter an incident title.");

  await prisma.$executeRaw`
    INSERT INTO "AdminIncident" ("id", "title", "details", "status", "createdAt", "updatedAt")
    VALUES (${randomUUID()}, ${title}, ${details || null}, 'OPEN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `;
  revalidatePath("/admin");
  return { ok: true };
}

export async function resolveAdminIncident(id: string) {
  await requireAdmin();
  const incidentId = id.trim();
  if (!incidentId) throw new Error("An incident ID is required.");

  const updated = await prisma.$executeRaw`
    UPDATE "AdminIncident"
    SET "status" = 'RESOLVED', "resolvedAt" = CURRENT_TIMESTAMP, "updatedAt" = CURRENT_TIMESTAMP
    WHERE "id" = ${incidentId} AND "status" = 'OPEN'
  `;
  if (updated === 0) {
    throw new Error("This incident was already resolved or no longer exists.");
  }

  revalidatePath("/admin");
  return { ok: true };
}
