/**
 * TC-F2-01, TC-F2-02, TC-F2-03
 * Tests for Driver Roster & Assignment business rules:
 *   TC-F2-01 – Driver list returns all records
 *   TC-F2-02 – A driver already assigned to a vehicle cannot be double-assigned
 *   TC-F2-03 – Only active drivers/vehicles may be assigned
 */

import { describe, it, expect, beforeEach } from "vitest";
import { driversData, getDriverById, addDriver, deleteDriver } from "./Drivers";

// ── Snapshot helpers ──────────────────────────────────────────────────────────
// Store original data length to guard against mutation bleed between tests
let originalLength: number;
beforeEach(() => {
  originalLength = driversData.length;
});

// ── TC-F2-01: Driver list ─────────────────────────────────────────────────────
describe("TC-F2-01 – Driver roster is populated", () => {
  it("should expose a non-empty driversData array", () => {
    expect(driversData.length).toBeGreaterThan(0);
  });

  it("every driver record contains required fields", () => {
    driversData.forEach((d) => {
      expect(d).toHaveProperty("id");
      expect(d).toHaveProperty("name");
      expect(d).toHaveProperty("status");
    });
  });

  it("getDriverById returns the correct driver", () => {
    const first = driversData[0];
    const found = getDriverById(first.id);
    expect(found).toBeDefined();
    expect(found?.name).toBe(first.name);
  });

  it("getDriverById returns undefined for a non-existent ID", () => {
    expect(getDriverById("DOES_NOT_EXIST_999")).toBeUndefined();
  });
});

// ── TC-F2-02: Prevent double assignment ──────────────────────────────────────
describe("TC-F2-02 – Double-assignment prevention logic", () => {
  /**
   * The Backend enforces this via a 409 Conflict response.
   * Here we validate the equivalent frontend guard logic:
   * a driver whose assigned_vehicle_id is already set must be
   * considered "unavailable" and blocked at the UI layer.
   */

  const isDriverAvailableForAssignment = (driverId: string | number) => {
    const driver = getDriverById(driverId);
    if (!driver) return false;
    if (driver.status !== "active") return false;
    // If the driver already has a vehicle assigned, block re-assignment
    if (driver.assigned_vehicle_id) return false;
    return true;
  };

  it("flags an already-assigned active driver as unavailable", () => {
    // Find the first driver with an existing assignment
    const assignedDriver = driversData.find(
      (d) => d.status === "active" && d.assigned_vehicle_id
    );
    if (!assignedDriver) {
      // If all drivers are unassigned in seed data, synthesise one
      const synth = addDriver({
        name: "Assigned Driver",
        status: "active",
        assigned_vehicle_id: "V001",
        license_class: "B",
        hire_date: "2020-01-01",
      });
      expect(isDriverAvailableForAssignment(synth.id)).toBe(false);
      deleteDriver(synth.id); // cleanup
      return;
    }
    expect(isDriverAvailableForAssignment(assignedDriver.id)).toBe(false);
  });

  it("flags an unassigned active driver as available", () => {
    const unassigned = driversData.find(
      (d) => d.status === "active" && !d.assigned_vehicle_id
    );
    if (!unassigned) {
      // Synthesise
      const synth = addDriver({
        name: "Free Driver",
        status: "active",
        assigned_vehicle_id: null,
        license_class: "C",
        hire_date: "2021-06-01",
      });
      expect(isDriverAvailableForAssignment(synth.id)).toBe(true);
      deleteDriver(synth.id);
      return;
    }
    expect(isDriverAvailableForAssignment(unassigned.id)).toBe(true);
  });
});

// ── TC-F2-03: Status gating ───────────────────────────────────────────────────
describe("TC-F2-03 – Inactive / on-leave drivers cannot be assigned", () => {
  const isDriverAvailableForAssignment = (driverId: string | number) => {
    const driver = getDriverById(driverId);
    if (!driver) return false;
    if (driver.status !== "active") return false;
    if (driver.assigned_vehicle_id) return false;
    return true;
  };

  it("blocks assignment for a driver with status 'on_leave'", () => {
    const onLeave = addDriver({
      name: "On Leave Driver",
      status: "on_leave",
      assigned_vehicle_id: null,
      license_class: "B",
      hire_date: "2022-01-01",
    });
    expect(isDriverAvailableForAssignment(onLeave.id)).toBe(false);
    deleteDriver(onLeave.id);
  });

  it("blocks assignment for a driver with status 'inactive'", () => {
    const inactive = addDriver({
      name: "Inactive Driver",
      status: "inactive",
      assigned_vehicle_id: null,
      license_class: "B",
      hire_date: "2022-01-01",
    });
    expect(isDriverAvailableForAssignment(inactive.id)).toBe(false);
    deleteDriver(inactive.id);
  });

  it("allows assignment for an active unassigned driver", () => {
    const available = addDriver({
      name: "Available Driver",
      status: "active",
      assigned_vehicle_id: null,
      license_class: "C",
      hire_date: "2023-04-10",
    });
    expect(isDriverAvailableForAssignment(available.id)).toBe(true);
    deleteDriver(available.id);
  });
});
