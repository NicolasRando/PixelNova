import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkService } from "@/lib/monitor";
import { getAuthSession } from "@/lib/session";

// Garde uniquement les 10 derniers checks "up" par service, ne supprime jamais les "down"
async function cleanupOldChecks(serviceId: string) {
  // Recupere les checks "up" tries du plus recent au plus ancien
  const upChecks = await prisma.check.findMany({
    where: { serviceId, status: "up" },
    orderBy: { checkedAt: "desc" },
    select: { id: true },
  });

  // Si plus de 10 checks "up", on supprime les plus anciens
  if (upChecks.length > 10) {
    const toDelete = upChecks.slice(10).map((c) => c.id);
    await prisma.check.deleteMany({
      where: { id: { in: toDelete } },
    });
  }
}

// POST /api/monitor — Verifie les services de l'utilisateur connecte
export async function POST() {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  try {
    const services = await prisma.service.findMany({
      where: { userId: session.user.id },
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

          // Nettoyer les anciens checks "up" apres chaque nouveau check
          await cleanupOldChecks(service.id);
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
