import { NextRequest, NextResponse } from "next/server";
import { getAuthSession, unauthorized } from "@/lib/session";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PUT(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const body = await request.json();
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Les deux mots de passe sont obligatoires" },
      { status: 400 }
    );
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "Le nouveau mot de passe doit contenir au moins 6 caracteres" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.password) {
    return NextResponse.json(
      { error: "Changement de mot de passe non disponible pour les comptes OAuth" },
      { status: 400 }
    );
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return NextResponse.json(
      { error: "Mot de passe actuel incorrect" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  return NextResponse.json({ message: "Mot de passe modifie" });
}
