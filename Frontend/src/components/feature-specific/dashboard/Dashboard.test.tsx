/**
 * TC-F4-01 – Fleet Utilization KPI
 * Formula: activeWithDriver / total × 100 (rounded)
 *
 * The UtilizationCard renders the percentage calculated
 * by the Backend and passed in via `data.utilizationPct`.
 * This test validates:
 *   1. The component renders the rounded utilization % correctly.
 *   2. Edge cases (0%, 100%, fractional percentages).
 *
 * TC-F9-01 – Risk Score Rendering
 * The RiskOverview component colour-codes vehicles:
 *   ≥ 75  → Critical (rose)
 *   40–74 → Medium  (amber)
 *   < 40  → Low     (emerald)
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UtilizationCard, UtilizationData } from "./UtilizationCard";
import { RiskOverview, RiskVehicle } from "./RiskOverview";

// ── TC-F4-01: Fleet utilization KPI ──────────────────────────────────────────
describe("TC-F4-01 – Fleet Utilization display", () => {
  const makeData = (
    total: number,
    active: number,
    activeWithDriver: number,
    pct: number
  ): UtilizationData => ({ total, active, activeWithDriver, utilizationPct: pct });

  it("renders the correct rounded utilization percentage", () => {
    // 60 / 120 = 50%
    render(<UtilizationCard data={makeData(120, 80, 60, 50)} locale="en" />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("renders 0% when no vehicles have an assigned driver", () => {
    render(<UtilizationCard data={makeData(100, 50, 0, 0)} locale="en" />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("renders 100% when all vehicles are assigned", () => {
    render(<UtilizationCard data={makeData(10, 10, 10, 100)} locale="en" />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("rounds fractional percentages (e.g. 33.33 → 33%)", () => {
    render(<UtilizationCard data={makeData(3, 3, 1, 33.33)} locale="en" />);
    expect(screen.getByText("33%")).toBeInTheDocument();
  });

  it("displays total fleet count", () => {
    render(<UtilizationCard data={makeData(120, 80, 60, 50)} locale="en" />);
    expect(screen.getByText("120 vehicles")).toBeInTheDocument();
  });

  it("displays number of active vehicles", () => {
    render(<UtilizationCard data={makeData(120, 80, 60, 50)} locale="en" />);
    expect(screen.getByText("80 active")).toBeInTheDocument();
  });

  it("displays driver-assigned count", () => {
    render(<UtilizationCard data={makeData(120, 80, 60, 50)} locale="en" />);
    expect(screen.getByText("60 driver-assigned")).toBeInTheDocument();
  });
});

// ── TC-F9-01: Risk score colour-coding ───────────────────────────────────────
describe("TC-F9-01 – Risk Score colour-coding in RiskOverview", () => {
  const makeVehicle = (id: string, score: number): RiskVehicle => ({
    vehicle_id: id,
    plate: `PLATE-${id}`,
    make: "Toyota",
    model: "HiAce",
    riskScore: score,
    status: "active",
  });

  const renderRisk = (vehicles: RiskVehicle[]) =>
    render(
      <MemoryRouter>
        <RiskOverview data={vehicles} />
      </MemoryRouter>
    );

  it("renders a critical vehicle (score ≥ 75) with rose colour class", () => {
    const { container } = renderRisk([makeVehicle("V1", 80)]);
    const badge = container.querySelector(".text-rose-600");
    expect(badge).toBeInTheDocument();
    expect(badge?.textContent).toBe("80%");
  });

  it("renders a medium-risk vehicle (score 40–74) with amber colour class", () => {
    const { container } = renderRisk([makeVehicle("V2", 55)]);
    const badge = container.querySelector(".text-amber-600");
    expect(badge).toBeInTheDocument();
    expect(badge?.textContent).toBe("55%");
  });

  it("renders a low-risk vehicle (score < 40) with emerald colour class", () => {
    const { container } = renderRisk([makeVehicle("V3", 20)]);
    const badge = container.querySelector(".text-emerald-600");
    expect(badge).toBeInTheDocument();
    expect(badge?.textContent).toBe("20%");
  });

  it("renders a score of exactly 75 as critical", () => {
    const { container } = renderRisk([makeVehicle("V4", 75)]);
    expect(container.querySelector(".text-rose-600")).toBeInTheDocument();
  });

  it("renders a score of exactly 40 as medium", () => {
    const { container } = renderRisk([makeVehicle("V5", 40)]);
    expect(container.querySelector(".text-amber-600")).toBeInTheDocument();
  });

  it("renders the vehicle plate in each row", () => {
    renderRisk([makeVehicle("V6", 60)]);
    expect(screen.getByText("PLATE-V6")).toBeInTheDocument();
  });
});
