import { requireAuth, requireRole } from "@/lib/auth";
import {
  handleRouteError,
  jsonOk,
  parseJsonBody,
} from "@/lib/api/http";
import {
  getOrgSettings,
  updateOrgSettings,
} from "@/repositories/org-settings.repository";
import { orgSettingsUpdateSchema } from "@/lib/validators/dashboard";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const settings = await getOrgSettings();
    return jsonOk(settings);
  } catch (e) {
    return handleRouteError(
      "[api/dashboard/settings]",
      e,
      "Erro ao carregar configurações.",
    );
  }
}

export async function PATCH(request: Request) {
  const { error } = await requireRole("admin");
  if (error) return error;

  const parsed = await parseJsonBody(request, orgSettingsUpdateSchema);
  if ("response" in parsed) return parsed.response;

  try {
    const settings = await updateOrgSettings(parsed.data);
    return jsonOk(settings);
  } catch (e) {
    return handleRouteError("[api/dashboard/settings PATCH]", e, "Erro ao salvar.");
  }
}
