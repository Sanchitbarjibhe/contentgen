import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({
      status: "ok",
      app: "reachable",
      database: "connected",
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[health] database check failed:", error);
    return Response.json(
      {
        status: "degraded",
        app: "reachable",
        database: "unreachable",
        error:
          "Database connection failed. Check DATABASE_URL, network connectivity, and database availability.",
        checkedAt: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
