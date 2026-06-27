export function getClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim();
  }

  return request.headers.get("x-real-ip") ?? undefined;
}

export function getUserAgent(request: Request): string | undefined {
  const ua = request.headers.get("user-agent");
  return ua ? ua.slice(0, 500) : undefined;
}
