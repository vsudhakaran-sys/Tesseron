import { describe, it, expect } from "vitest";
import { formatType } from "./Vehicles";

describe("Vehicles Registry Helpers", () => {
  describe("formatType function", () => {
    it("should format snake_case vehicle types to Capitalized Words", () => {
      expect(formatType("cargo_van")).toBe("Cargo Van");
      expect(formatType("box_truck")).toBe("Box Truck");
      expect(formatType("heavy_truck")).toBe("Heavy Truck");
      expect(formatType("pickup")).toBe("Pickup");
    });

    it("should return the fallback dash string if type is null or undefined", () => {
      expect(formatType(null)).toBe("—");
      expect(formatType("")).toBe("—");
    });
  });

  describe("Registry Search & Filter Logic", () => {
    const mockVehicles = [
      { id: "V001", displayName: "AB-123-CD", manufacturer: "Volvo", model: "FH16", status: "active" },
      { id: "V002", displayName: "EF-456-GH", manufacturer: "Tesla", model: "Semi", status: "idle" },
      { id: "V003", displayName: "IJ-789-KL", manufacturer: "Volvo", model: "FL", status: "in_shop" },
    ];

    it("should filter vehicles by search query case-insensitively", () => {
      const query = "volvo";
      const filtered = mockVehicles.filter(
        (v) =>
          v.displayName.toLowerCase().includes(query.toLowerCase()) ||
          v.manufacturer.toLowerCase().includes(query.toLowerCase()) ||
          v.model.toLowerCase().includes(query.toLowerCase())
      );
      expect(filtered.length).toBe(2);
      expect(filtered[0].id).toBe("V001");
      expect(filtered[1].id).toBe("V003");
    });

    it("should filter vehicles by status correctly", () => {
      const statusFilter = "idle";
      const filtered = mockVehicles.filter((v) => !statusFilter || v.status === statusFilter);
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe("V002");
    });
  });
});
