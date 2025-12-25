export type Platform = "ios" | "android" | "other";

export function detectPlatform(userAgent: string | null | undefined): Platform {
  const ua = (userAgent ?? "").toLowerCase();
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod"))
    return "ios";
  if (ua.includes("android")) return "android";
  return "other";
}

export function joinPathSegments(segments: string[]): string {
  const cleaned = segments
    .filter(Boolean)
    .map((s) => s.replace(/^\/+|\/+$/g, ""));
  return cleaned.join("/");
}
