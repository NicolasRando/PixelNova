import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

// GET /api/services/:id/checks — Historique des checks
export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;

  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) {
    return NextResponse.json(
      { error: "Service non trouve" },
      { status: 404 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
  const offset = parseInt(searchParams.get("offset") || "0");

  const [checks, total] = await Promise.all([
    prisma.check.findMany({
      where: { serviceId: id },
      orderBy: { checkedAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.check.count({ where: { serviceId: id } }),
  ]);

  return NextResponse.json({ checks, total });
}
