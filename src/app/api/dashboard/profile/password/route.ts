import { requireAuth } from "@/lib/auth";
import {
  handleRouteError,
  jsonError,
  jsonOk,
  parseJsonBody,
} from "@/lib/api/http";
import { changeUserPassword } from "@/repositories/profiles.repository";
import { passwordChangeSchema } from "@/lib/validators/dashboard";

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const parsed = await parseJsonBody(request, passwordChangeSchema);
  if ("response" in parsed) return parsed.response;

  try {
    const result = await changeUserPassword(
      user!.id,
      parsed.data.currentPassword,
      parsed.data.password,
    );

    if (!result.ok) {
      return jsonError(result.error, result.status);
    }

    return jsonOk({ success: true });
  } catch (e) {
    return handleRouteError(
      "[api/dashboard/profile/password]",
      e,
      "Erro ao alterar senha.",
    );
  }
}
