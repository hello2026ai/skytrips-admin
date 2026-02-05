import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChangePasswordModal from "../ChangePasswordModal";
import { z } from "zod";

// Mock Supabase
const mockUpdateUser = vi.fn();
const mockSignInWithPassword = vi.fn();
const mockGetUser = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      updateUser: (args: any) => mockUpdateUser(args),
      signInWithPassword: (args: any) => mockSignInWithPassword(args),
      getUser: () => mockGetUser(),
    },
  },
}));

describe("ChangePasswordModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: { email: "test@example.com" } } });
  });

  it("renders nothing when closed", () => {
    render(<ChangePasswordModal isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText("Change Password")).not.toBeInTheDocument();
  });

  it("renders form fields when open", () => {
    render(<ChangePasswordModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByLabelText("Current Password")).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
  });

  it("validates password matching", async () => {
    render(<ChangePasswordModal isOpen={true} onClose={() => {}} />);
    
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "Password123!" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "Mismatch123!" } });
    
    fireEvent.click(screen.getByRole("button", { name: /update password/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("validates password strength", async () => {
    render(<ChangePasswordModal isOpen={true} onClose={() => {}} />);
    
    // Too short
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "Weak1!" } });
    fireEvent.click(screen.getByRole("button", { name: /update password/i }));
    
    await waitFor(() => {
      expect(screen.getByText("Password must be at least 8 characters")).toBeInTheDocument();
    });
  });

  it("handles successful password update", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });
    mockUpdateUser.mockResolvedValue({ error: null });
    
    const handleClose = vi.fn();
    render(<ChangePasswordModal isOpen={true} onClose={handleClose} />);
    
    fireEvent.change(screen.getByLabelText("Current Password"), { target: { value: "OldPass123!" } });
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "NewPass123!" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "NewPass123!" } });
    
    fireEvent.click(screen.getByRole("button", { name: /update password/i }));
    
    await waitFor(() => {
      expect(screen.getByText("Password Updated!")).toBeInTheDocument();
    });
  });

  it("handles incorrect current password", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: { message: "Invalid login credentials" } });
    
    render(<ChangePasswordModal isOpen={true} onClose={() => {}} />);
    
    fireEvent.change(screen.getByLabelText("Current Password"), { target: { value: "WrongPass123!" } });
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "NewPass123!" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "NewPass123!" } });
    
    fireEvent.click(screen.getByRole("button", { name: /update password/i }));
    
    await waitFor(() => {
      expect(screen.getByText("Incorrect current password")).toBeInTheDocument();
    });
  });

  it("toggles password visibility", () => {
    render(<ChangePasswordModal isOpen={true} onClose={() => {}} />);
    
    const input = screen.getByLabelText("New Password");
    expect(input).toHaveAttribute("type", "password");
    
    // Find toggle button (using aria-label or just the second visibility button)
    // The component has 3 visibility buttons. 2nd one is for New Password.
    const toggleBtns = screen.getAllByRole("button", { name: /show password/i });
    fireEvent.click(toggleBtns[1]);
    
    expect(input).toHaveAttribute("type", "text");
  });
});
