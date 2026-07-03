import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import {
  getOrgSettings,
  updateOrgSettings,
  getProfile,
  updateProfile,
} from "@/repositories/settings.repository";

export async function GET(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const type = new URL(request.url).searchParams.get("type");

  try {
    if (type === "profile") {
      const profile = await getProfile(user!.id);
      return NextResponse.json(profile);
    }

    const settings = await getOrgSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Erro ao carregar configurações." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const type = new URL(request.url).searchParams.get("type");

  try {
    if (type === "profile") {
      const profile = await updateProfile(user!.id, body);
      return NextResponse.json(profile);
    }

    const settings = await updateOrgSettings(body);
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Erro ao salvar." }, { status: 500 });
  }
}
