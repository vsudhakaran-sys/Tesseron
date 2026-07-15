// ─── Persona gate (prototype) ────────────────────────────────────────────────
// Distinguishes the internal TESSERON staff app from the customer-facing portal.
// In production this resolves from the authenticated session (OIDC role claims).
// Until then it reads an optional override from localStorage and defaults to
// "TESSERON-admin" so the internal consolidated views are visible in the mock app.

export type Persona = "TESSERON-admin" | "TESSERON-staff" | "customer";

const PERSONAS: Persona[] = ["TESSERON-admin", "TESSERON-staff", "customer"];

export function getPersona(): Persona {
  try {
    const explicit = localStorage.getItem("TESSERON_persona");
    if (explicit && (PERSONAS as string[]).includes(explicit)) {
      return explicit as Persona;
    }
    const raw = localStorage.getItem("TESSERON_user");
    if (raw) {
      const parsed = JSON.parse(raw) as { role?: string } | null;
      if (parsed?.role && (PERSONAS as string[]).includes(parsed.role)) {
        return parsed.role as Persona;
      }
    }
  } catch {
    /* ignore malformed storage */
  }
  return "TESSERON-admin";
}

/** TESSERON administrators get the consolidated customer overview (org + users). */
export function isTESSERONAdmin(): boolean {
  return getPersona() === "TESSERON-admin";
}


