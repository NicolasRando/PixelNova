import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

// GET /api/services/:id — Detail d'un service
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      checks: {
        orderBy: { checkedAt: "desc" },
        take: 1,
      },
    },
  });

  if (!service) {
    return NextResponse.json(
      { error: "Service non trouve" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ...service,
    lastCheck: service.checks[0] || null,
    checks: undefined,
  });
}

// PUT /api/services/:id — Modifie un service
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(
      { error: "Service non trouve" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const { name, url, interval } = body;

    // Validation partielle (seuls les champs fournis sont valides)
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
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
    }

    if (url !== undefined) {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return NextResponse.json(
          { error: "L'URL doit commencer par http:// ou https://" },
          { status: 400 }
        );
      }
    }

    if (interval !== undefined) {
      const validIntervals = [1, 5, 15, 30];
      if (!validIntervals.includes(interval)) {
        return NextResponse.json(
          { error: "L'intervalle doit etre 1, 5, 15 ou 30 minutes" },
          { status: 400 }
        );
      }
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(url !== undefined && { url: url.trim() }),
        ...(interval !== undefined && { interval }),
      },
    });

    return NextResponse.json(service);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la modification du service" },
      { status: 500 }
    );
  }
}

// DELETE /api/services/:id — Supprime un service et ses checks
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(
      { error: "Service non trouve" },
      { status: 404 }
    );
  }

  await prisma.service.delete({ where: { id } });

  return NextResponse.json({ message: "Service supprime" });
}
