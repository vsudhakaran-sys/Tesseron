/**
 * TC-F3-01, TC-F3-02, TC-F3-03
 * Tests the `getMaintenanceStatus` overdue business rule:
 *   A vehicle is OVERDUE if:
 *     - It has never been serviced (no last_service_date / odometer), OR
 *     - > 10,000 km since last service, OR
 *     - > 180 days since last service
 *
 * ANCHOR DATE used in the implementation: 2026-07-24
 */

import { describe, it, expect } from "vitest";
import { getMaintenanceStatus } from "./Maintenance";

// Helper to build a minimal MaintenanceRecord shape
const makeRecord = (overrides: {
  vehicle_last_service_date?: string | null;
  vehicle_last_service_odometer?: number | null;
  vehicle_odometer?: number;
}) => ({
  vehicle_id: "V-TEST",
  plate: "TEST-001",
  make: "Toyota",
  model: "HiAce",
  type: null,
  vehicle_odometer: 0,
  vehicle_last_service_date: null,
  vehicle_last_service_odometer: null,
  ...overrides,
});

// ── TC-F3-01: Overdue by mileage ──────────────────────────────────────────────
describe("TC-F3-01 – Overdue by mileage (> 10,000 km)", () => {
  it("returns OVERDUE when km since last service exceeds 10,000", () => {
    const record = makeRecord({
      vehicle_last_service_date: "2026-02-01",   // well within 180 days
      vehicle_last_service_odometer: 1000,
      vehicle_odometer: 12000,                    // 11,000 km delta
    });
    expect(getMaintenanceStatus(record)).toBe("OVERDUE");
  });

  it("returns COMPLIANT when km since last service is exactly 10,000", () => {
    const record = makeRecord({
      vehicle_last_service_date: "2026-02-01",
      vehicle_last_service_odometer: 2000,
      vehicle_odometer: 12000,                    // 10,000 km delta — not over
    });
    expect(getMaintenanceStatus(record)).toBe("COMPLIANT");
  });

  it("returns COMPLIANT when km since last service is under 10,000", () => {
    const record = makeRecord({
      vehicle_last_service_date: "2026-06-01",
      vehicle_last_service_odometer: 5000,
      vehicle_odometer: 14000,                    // 9,000 km delta
    });
    expect(getMaintenanceStatus(record)).toBe("COMPLIANT");
  });
});

// ── TC-F3-02: Overdue by time (> 180 days) ────────────────────────────────────
describe("TC-F3-02 – Overdue by time elapsed (> 180 days)", () => {
  it("returns OVERDUE when last service was > 180 days ago", () => {
    const record = makeRecord({
      // Anchor = 2026-07-24; 200 days before that = approx 2026-01-05
      vehicle_last_service_date: "2026-01-05",
      vehicle_last_service_odometer: 10000,
      vehicle_odometer: 10100,                    // minimal km, overdue by time
    });
    expect(getMaintenanceStatus(record)).toBe("OVERDUE");
  });

  it("returns COMPLIANT when last service was within 180 days", () => {
    const record = makeRecord({
      // Anchor = 2026-07-24; 10 days before = 2026-07-14
      vehicle_last_service_date: "2026-07-14",
      vehicle_last_service_odometer: 10000,
      vehicle_odometer: 10050,                    // 50 km — clearly within range
    });
    expect(getMaintenanceStatus(record)).toBe("COMPLIANT");
  });
});

// ── TC-F3-03: Overdue by "never serviced" ─────────────────────────────────────
describe("TC-F3-03 – Overdue when never serviced", () => {
  it("returns OVERDUE when vehicle_last_service_date is null", () => {
    const record = makeRecord({
      vehicle_last_service_date: null,
      vehicle_last_service_odometer: 5000,
      vehicle_odometer: 6000,
    });
    expect(getMaintenanceStatus(record)).toBe("OVERDUE");
  });

  it("returns OVERDUE when vehicle_last_service_odometer is null", () => {
    const record = makeRecord({
      vehicle_last_service_date: "2026-06-01",
      vehicle_last_service_odometer: null,
      vehicle_odometer: 6000,
    });
    expect(getMaintenanceStatus(record)).toBe("OVERDUE");
  });

  it("returns OVERDUE when both service date and odometer are null", () => {
    const record = makeRecord({
      vehicle_last_service_date: null,
      vehicle_last_service_odometer: null,
    });
    expect(getMaintenanceStatus(record)).toBe("OVERDUE");
  });
});
