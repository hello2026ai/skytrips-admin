import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CompanyLogo } from "../CompanyLogo";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("CompanyLogo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    mockFetch.mockReturnValue(new Promise(() => {})); // Never resolves
    render(<CompanyLogo />);
    // Check for the loading skeleton class
    const skeleton = document.querySelector(".animate-pulse");
    expect(skeleton).toBeInTheDocument();
  });

  it("renders logo image when fetch succeeds", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ logo_url: "https://example.com/logo.png" }),
    });

    render(<CompanyLogo />);

    await waitFor(() => {
      const img = screen.getByRole("img", { name: "Company Logo" });
      expect(img).toHaveAttribute("src", "https://example.com/logo.png");
    });
  });

  it("renders fallback text when logo url is missing", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ logo_url: "" }),
    });

    render(<CompanyLogo fallbackText="Custom Fallback" />);

    await waitFor(() => {
      expect(screen.getByText("Custom Fallback")).toBeInTheDocument();
    });
  });

  it("renders fallback text when fetch fails", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    render(<CompanyLogo />);

    await waitFor(() => {
      expect(screen.getByText("admin panel")).toBeInTheDocument();
    });
  });

  it("renders fallback text when image load fails", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ logo_url: "https://example.com/broken.png" }),
    });

    render(<CompanyLogo />);

    await waitFor(() => {
        const img = screen.getByRole("img", { name: "Company Logo" });
        fireEvent.error(img);
    });

    expect(screen.getByText("admin panel")).toBeInTheDocument();
  });
});
