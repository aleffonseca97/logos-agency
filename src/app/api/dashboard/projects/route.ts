import { requireAuth, requireRole } from "@/lib/auth";
import {
  handleRouteError,
  jsonCreated,
  jsonOk,
  parseJsonBody,
} from "@/lib/api/http";
import { createProject, findProjects } from "@/repositories/projects.repository";
import { projectCreateSchema } from "@/lib/validators/dashboard";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const projects = await findProjects();
    return jsonOk(projects);
  } catch (e) {
    return handleRouteError("[api/dashboard/projects]", e, "Erro ao carregar projetos.");
  }
}

export async function POST(request: Request) {
  const { user, error } = await requireRole("admin");
  if (error) return error;

  const parsed = await parseJsonBody(request, projectCreateSchema);
  if ("response" in parsed) return parsed.response;

  try {
    const project = await createProject({
      client_id: parsed.data.client_id ?? null,
      lead_id: parsed.data.lead_id ?? null,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      status: parsed.data.status,
      budget: parsed.data.budget ?? null,
      started_at: parsed.data.started_at ?? null,
      completed_at: parsed.data.completed_at ?? null,
      created_by: user!.id,
    });
    return jsonCreated(project);
  } catch (e) {
    return handleRouteError("[api/dashboard/projects POST]", e, "Erro ao criar projeto.");
  }
}
