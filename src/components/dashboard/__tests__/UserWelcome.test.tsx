import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserWelcome } from "../UserWelcome";

// Mock Supabase client
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockFrom = vi.fn();
const mockChannel = vi.fn();
const mockGetUser = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (table: string) => {
      mockFrom(table);
      return {
        select: (columns: string) => {
          mockSelect(columns);
          return {
            eq: (col: string, val: any) => {
              mockEq(col, val);
              return {
                single: mockSingle,
              };
            },
          };
        },
      };
    },
    auth: {
      getUser: () => mockGetUser(),
    },
    channel: () => {
        mockChannel();
        return {
            on: () => ({ subscribe: () => {} }),
        }
    },
    removeChannel: vi.fn(),
  },
}));

describe("UserWelcome", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: null } });
  });

  it("renders loading state initially", () => {
    mockSingle.mockReturnValue(new Promise(() => {})); // Never resolves
    render(<UserWelcome email="test@example.com" />);
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("renders user name when profile fetch succeeds", async () => {
    mockSingle.mockResolvedValue({
      data: { first_name: "John", last_name: "Doe" },
      error: null,
    });

    render(<UserWelcome email="test@example.com" />);

    await waitFor(() => {
      expect(screen.getByText("Welcome back, John Doe")).toBeInTheDocument();
    });
  });

  it("renders fallback email username when profile has no name", async () => {
    mockSingle.mockResolvedValue({
      data: { first_name: null, last_name: null },
      error: null,
    });

    render(<UserWelcome email="test@example.com" />);

    await waitFor(() => {
      expect(screen.getByText("Welcome back, test")).toBeInTheDocument();
    });
  });

  it("renders fallback email username when profile fetch fails", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "Error" },
    });

    render(<UserWelcome email="test@example.com" />);

    await waitFor(() => {
      expect(screen.getByText("Welcome back, test")).toBeInTheDocument();
    });
  });

  it("renders 'Admin' fallback when no email provided and auth.getUser returns null", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    render(<UserWelcome />);
    
    await waitFor(() => {
        expect(screen.getByText("Welcome back, Admin")).toBeInTheDocument();
    });
  });
});
