import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { findProjects, createProject } from "@/repositories/settings.repository";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const projects = await findProjects();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Erro ao carregar projetos." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();

  try {
    const project = await createProject({
      ...body,
      created_by: user!.id,
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Erro ao criar projeto." }, { status: 500 });
  }
}
