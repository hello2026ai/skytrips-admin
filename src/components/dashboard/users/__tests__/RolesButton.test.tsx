import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RolesButton } from "../RolesButton";

// Mock useRouter
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("RolesButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the button correctly", () => {
    render(<RolesButton />);
    const button = screen.getByRole("button", { name: /show system roles/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Show Roles");
  });

  it("navigates to roles page when clicked", () => {
    render(<RolesButton />);
    const button = screen.getByRole("button", { name: /show system roles/i });
    
    fireEvent.click(button);
    
    expect(mockPush).toHaveBeenCalledWith("/dashboard/roles");
  });

  it("shows loading state when clicked", () => {
    render(<RolesButton />);
    const button = screen.getByRole("button", { name: /show system roles/i });
    
    fireEvent.click(button);
    
    // Should show loading spinner
    expect(button).toBeDisabled();
    // The spinner is rendered as a span with border classes
    const spinner = button.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });
});
