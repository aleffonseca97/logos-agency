import { requireAuth } from "@/lib/auth";
import {
  handleRouteError,
  jsonOk,
  parseJsonBody,
} from "@/lib/api/http";
import { getProfile, updateProfile } from "@/repositories/profiles.repository";
import { profileUpdateSchema } from "@/lib/validators/dashboard";

export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const profile = await getProfile(user!.id);
    return jsonOk(profile);
  } catch (e) {
    return handleRouteError(
      "[api/dashboard/profile]",
      e,
      "Erro ao carregar perfil.",
    );
  }
}

export async function PATCH(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const parsed = await parseJsonBody(request, profileUpdateSchema);
  if ("response" in parsed) return parsed.response;

  try {
    const profile = await updateProfile(user!.id, parsed.data);
    return jsonOk(profile);
  } catch (e) {
    return handleRouteError("[api/dashboard/profile PATCH]", e, "Erro ao salvar.");
  }
}
