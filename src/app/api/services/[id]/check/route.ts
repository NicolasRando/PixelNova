import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkService } from "@/lib/monitor";

type Params = { params: Promise<{ id: string }> };

// POST /api/services/:id/check — Declenche un check manuel
export async function POST(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) {
    return NextResponse.json(
      { error: "Service non trouve" },
      { status: 404 }
    );
  }

  try {
    const check = await checkService(id);
    return NextResponse.json(check);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du check" },
      { status: 500 }
    );
  }
}
