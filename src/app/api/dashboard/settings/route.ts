import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import {
  getOrgSettings,
  updateOrgSettings,
  getProfile,
  updateProfile,
} from "@/repositories/settings.repository";

export async function GET(request: Request) {
  const { supabase, user, error } = await requireAuth();
  if (error) return error;

  const type = new URL(request.url).searchParams.get("type");

  try {
    if (type === "profile") {
      const profile = await getProfile(supabase, user!.id);
      return NextResponse.json(profile);
    }

    const settings = await getOrgSettings(supabase);
    return NextResponse.json(settings);
  } catch (e) {
    return NextResponse.json({ error: "Erro ao carregar configurações." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { supabase, user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const type = new URL(request.url).searchParams.get("type");

  try {
    if (type === "profile") {
      const profile = await updateProfile(supabase, user!.id, body);
      return NextResponse.json(profile);
    }

    const settings = await updateOrgSettings(supabase, body);
    return NextResponse.json(settings);
  } catch (e) {
    return NextResponse.json({ error: "Erro ao salvar." }, { status: 500 });
  }
}
