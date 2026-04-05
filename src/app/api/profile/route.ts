import { NextRequest, NextResponse } from "next/server";
import { getAuthSession, unauthorized } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      emailVerified: true,
      createdAt: true,
      _count: { select: { services: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur non trouve" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const body = await request.json();
  const { name } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Le nom est obligatoire" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name: name.trim() },
    select: { id: true, name: true, email: true, image: true },
  });

  return NextResponse.json(user);
}
