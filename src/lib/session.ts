import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth";

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export function unauthorized() {
  return NextResponse.json(
    { error: "Non autorise. Connectez-vous." },
    { status: 401 }
  );
}
