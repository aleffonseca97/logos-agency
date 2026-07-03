import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { findEvents, createEvent } from "@/repositories/events.repository";

export async function GET(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  try {
    const events = await findEvents(
      start && end ? { start, end } : undefined,
    );
    return NextResponse.json(events);
  } catch {
    return NextResponse.json({ error: "Erro ao carregar agenda." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();

  try {
    const event = await createEvent({
      ...body,
      created_by: user!.id,
    });
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: "Erro ao criar evento." }, { status: 500 });
  }
}
