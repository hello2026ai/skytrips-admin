import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RolesPage from "../page";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock RoleSidebar
vi.mock("@/components/dashboard/roles/RoleSidebar", () => ({
  RoleSidebar: ({ roles, onSelectRole, onAddRole, onDeleteRole }: any) => (
    <div data-testid="role-sidebar">
      <button onClick={onAddRole}>Add New</button>
      {roles.map((role: any) => (
        <div key={role.id} onClick={() => onSelectRole(role)} data-testid={`role-${role.id}`}>
          {role.name}
          <button onClick={() => onDeleteRole(role.id)} data-testid={`delete-${role.id}`}>Delete</button>
        </div>
      ))}
    </div>
  ),
}));

// Mock PermissionMatrix
vi.mock("@/components/dashboard/roles/PermissionMatrix", () => ({
  PermissionMatrix: ({ role, onUpdateRoleName, onSave, onCancel }: any) => (
    <div data-testid="permission-matrix">
      <input 
        value={role.name} 
        onChange={(e) => onUpdateRoleName(e.target.value)} 
        data-testid="role-name-input"
      />
      <button onClick={onSave}>Save Role</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

// Mock CreateRoleModal
vi.mock("@/components/dashboard/roles/CreateRoleModal", () => ({
  default: ({ isOpen, onClose, onSuccess }: any) => (
    isOpen ? (
      <div data-testid="create-role-modal">
        <button onClick={onClose}>Close Modal</button>
        <button onClick={() => onSuccess({ id: "3", name: "New Created Role", modules: [] })}>
          Create Role
        </button>
      </div>
    ) : null
  ),
}));

// Mock ToastContext
vi.mock("@/components/ui/ToastContext", () => ({
  useToast: () => ({
    addToast: vi.fn(),
  }),
}));

// Mock useUserPermissions
vi.mock("@/hooks/useUserPermissions", () => ({
  useUserPermissions: () => ({
    can: vi.fn().mockReturnValue(true),
    loading: false,
  }),
}));

describe("RolesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [
        { id: "1", name: "Manager", modules: [], is_system: true },
        { id: "2", name: "Staff", modules: [], is_system: true },
      ],
    });
  });

  it("fetches and displays roles on mount", async () => {
    render(<RolesPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("role-1")).toBeInTheDocument();
      expect(screen.getByTestId("role-2")).toBeInTheDocument();
    });
  });

  it("handles opening the create role modal", async () => {
    render(<RolesPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("role-sidebar")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Add New"));

    await waitFor(() => {
      expect(screen.getByTestId("create-role-modal")).toBeInTheDocument();
    });
  });

  it("handles creating a new role via modal", async () => {
    render(<RolesPage />);
    
    // Wait for initial load
    await waitFor(() => expect(screen.getByTestId("role-sidebar")).toBeInTheDocument());

    // Open modal
    fireEvent.click(screen.getByText("Add New"));
    
    // Click create button in mock modal (triggers onSuccess)
    fireEvent.click(screen.getByText("Create Role"));

    // Expect the new role to be added to the list
    await waitFor(() => {
      expect(screen.getByTestId("role-3")).toBeInTheDocument();
    });
  });

  it("handles updating an existing role", async () => {
    render(<RolesPage />);
    
    await waitFor(() => expect(screen.getByTestId("role-1")).toBeInTheDocument());

    // Select role 1
    fireEvent.click(screen.getByTestId("role-1"));

    await waitFor(() => expect(screen.getByTestId("permission-matrix")).toBeInTheDocument());

    // Update name
    fireEvent.change(screen.getByTestId("role-name-input"), { target: { value: "Updated Manager" } });

    // Mock save response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "1", name: "Updated Manager", modules: [] }),
    });

    // Save
    fireEvent.click(screen.getByText("Save Role"));

    // Verify fetch called with PUT
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/roles/1", expect.objectContaining({
        method: "PUT"
      }));
    });
  });

  it("handles deleting a role", async () => {
    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, "confirm").mockImplementation(() => true);

    render(<RolesPage />);
    
    await waitFor(() => expect(screen.getByTestId("role-1")).toBeInTheDocument());

    // Mock delete response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    fireEvent.click(screen.getByTestId("delete-1"));

    await waitFor(() => {
      expect(screen.queryByTestId("role-1")).not.toBeInTheDocument();
    });

    confirmSpy.mockRestore();
  });
});
