import { auth } from "./auth";
import { NextResponse } from "next/server";

export async function getAuthSession() {
  return auth();
}

export function unauthorized() {
  return NextResponse.json(
    { error: "Non autorise. Connectez-vous." },
    { status: 401 }
  );
}
