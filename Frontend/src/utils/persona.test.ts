import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getPersona, isTESSERONAdmin } from "./persona";

describe("Persona Helper Utilities", () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      clear: () => {
        store = {};
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    };
  })();

  beforeEach(() => {
    vi.stubGlobal("localStorage", localStorageMock);
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should default to TESSERON-admin when storage is empty", () => {
    expect(getPersona()).toBe("TESSERON-admin");
    expect(isTESSERONAdmin()).toBe(true);
  });

  it("should return the explicit persona if TESSERON_persona is set to a valid value", () => {
    localStorage.setItem("TESSERON_persona", "customer");
    expect(getPersona()).toBe("customer");
    expect(isTESSERONAdmin()).toBe(false);
  });

  it("should ignore invalid TESSERON_persona values and fallback", () => {
    localStorage.setItem("TESSERON_persona", "invalid-role");
    expect(getPersona()).toBe("TESSERON-admin");
    expect(isTESSERONAdmin()).toBe(true);
  });

  it("should parse TESSERON_user role if TESSERON_persona is not set", () => {
    localStorage.setItem("TESSERON_user", JSON.stringify({ role: "TESSERON-staff" }));
    expect(getPersona()).toBe("TESSERON-staff");
    expect(isTESSERONAdmin()).toBe(false);
  });
});
