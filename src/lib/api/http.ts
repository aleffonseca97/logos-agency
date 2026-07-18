import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";

export type ApiErrorBody = {
  error: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
};

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, { status: init?.status ?? 200, ...init });
}

export function jsonCreated<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function jsonError(
  message: string,
  status: number,
  extra?: Record<string, unknown>,
) {
  const body: ApiErrorBody = { error: message, ...extra };
  return NextResponse.json(body, { status });
}

export function zodFieldErrors(error: ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "_form";
    if (!errors[key]) errors[key] = [];
    errors[key].push(issue.message);
  }
  return errors;
}

export async function parseJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<{ data: T } | { response: NextResponse }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { response: jsonError("Dados inválidos.", 400) };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      response: jsonError("Dados inválidos.", 400, {
        errors: zodFieldErrors(parsed.error),
      }),
    };
  }

  return { data: parsed.data };
}

export function handleRouteError(tag: string, error: unknown, fallback: string) {
  console.error(tag, error);
  return jsonError(fallback, 500);
}
