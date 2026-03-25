import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkService } from "@/lib/monitor";

// GET /api/services — Liste tous les services avec leur dernier check
export async function GET() {
  const services = await prisma.service.findMany({
    include: {
      checks: {
        orderBy: { checkedAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = services.map((service) => ({
    ...service,
    lastCheck: service.checks[0] || null,
    checks: undefined,
  }));

  return NextResponse.json(result);
}

// POST /api/services — Cree un nouveau service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url, interval } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Le nom est obligatoire" },
        { status: 400 }
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: "Le nom ne doit pas depasser 50 caracteres" },
        { status: 400 }
      );
    }

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "L'URL est obligatoire" },
        { status: 400 }
      );
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return NextResponse.json(
        { error: "L'URL doit commencer par http:// ou https://" },
        { status: 400 }
      );
    }

    const validIntervals = [1, 5, 15, 30];
    if (!validIntervals.includes(interval)) {
      return NextResponse.json(
        { error: "L'intervalle doit etre 1, 5, 15 ou 30 minutes" },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name: name.trim(),
        url: url.trim(),
        interval,
      },
    });

    // Lancer un premier check immediatement
    const firstCheck = await checkService(service.id);

    return NextResponse.json(
      { ...service, lastCheck: firstCheck },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la creation du service" },
      { status: 500 }
    );
  }
}
