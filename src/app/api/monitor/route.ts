import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkService } from "@/lib/monitor";

// POST /api/monitor — Verifie tous les services dont le check est expire
export async function POST() {
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

      // Si pas de check ou si le dernier check est plus ancien que l'intervalle
      const needsCheck =
        !lastCheck ||
        now - new Date(lastCheck.checkedAt).getTime() >= intervalMs;

      if (needsCheck) {
        try {
          const check = await checkService(service.id);
          results.push({ serviceId: service.id, name: service.name, check });
        } catch {
          results.push({ serviceId: service.id, name: service.name, error: true });
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
