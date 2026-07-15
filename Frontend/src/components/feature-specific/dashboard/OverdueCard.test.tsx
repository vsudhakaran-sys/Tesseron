import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OverdueCard } from "./OverdueCard";

describe("OverdueCard Component", () => {
  it("should render the component with correct count", () => {
    render(<OverdueCard count={5} />);
    
    // Check if the title/compliance header exists
    expect(screen.getByText("Maintenance Compliance")).toBeInTheDocument();
    
    // Check if the correct count is displayed
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("overdue for service")).toBeInTheDocument();
  });

  it("should apply non-high alert classes when count <= 10", () => {
    const { container } = render(<OverdueCard count={10} />);
    const alertDiv = container.querySelector(".bg-warning\\/10");
    expect(alertDiv).toBeInTheDocument();
    expect(alertDiv).not.toHaveClass("animate-pulse");
  });

  it("should apply high alert and pulse classes when count > 10", () => {
    const { container } = render(<OverdueCard count={15} />);
    const alertDiv = container.querySelector(".bg-destructive\\/10");
    expect(alertDiv).toBeInTheDocument();
    expect(alertDiv).toHaveClass("animate-pulse");
  });
});
