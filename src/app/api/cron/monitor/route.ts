import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkService } from "@/lib/monitor";

// Garde uniquement les 10 derniers checks "up" par service
async function cleanupOldChecks(serviceId: string) {
  const upChecks = await prisma.check.findMany({
    where: { serviceId, status: "up" },
    orderBy: { checkedAt: "desc" },
    select: { id: true },
  });

  if (upChecks.length > 10) {
    const toDelete = upChecks.slice(10).map((c) => c.id);
    await prisma.check.deleteMany({
      where: { id: { in: toDelete } },
    });
  }
}

// GET /api/cron/monitor — Appele par Vercel Cron, securise par CRON_SECRET
export async function GET(request: NextRequest) {
  // Verifier le secret pour empecher les appels externes
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  try {
    const services = await prisma.service.findMany({
      include: {
        checks: {
          orderBy: { checkedAt: "desc" },
          take: 1,
        },
      },
    });

    const now = Date.now();
    const results = [];

    for (const service of services) {
      const lastCheck = service.checks[0];
      const intervalMs = service.interval * 60 * 1000;

      const needsCheck =
        !lastCheck ||
        now - new Date(lastCheck.checkedAt).getTime() >= intervalMs;

      if (needsCheck) {
        try {
          const check = await checkService(service.id);
          results.push({ service: service.name, status: check.status, latency: check.latency });
          await cleanupOldChecks(service.id);
        } catch {
          results.push({ service: service.name, error: true });
        }
      }
    }

    return NextResponse.json({
      checked: results.length,
      total: services.length,
      results,
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du monitoring" },
      { status: 500 }
    );
  }
}
