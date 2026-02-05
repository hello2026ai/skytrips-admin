export type PermissionType = "view" | "add" | "edit" | "delete";

export interface ModulePermission {
  id: string;
  name: string;
  description: string;
  icon: string;
  permissions: {
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
  };
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystem?: boolean;
  modules: ModulePermission[];
}

export const INITIAL_MODULES: ModulePermission[] = [
  {
    id: "flights",
    name: "Flights",
    description: "Manage flight inventory and schedules",
    icon: "flight",
    permissions: { view: false, add: false, edit: false, delete: false },
  },
  {
    id: "hotels",
    name: "Hotels",
    description: "Hotel bookings and inventory",
    icon: "hotel",
    permissions: { view: false, add: false, edit: false, delete: false },
  },
  {
    id: "customers",
    name: "Customers",
    description: "View and edit guest profiles",
    icon: "group",
    permissions: { view: false, add: false, edit: false, delete: false },
  },
  {
    id: "travellers",
    name: "Travellers",
    description: "Manage traveller details and documents",
    icon: "person_pin_circle",
    permissions: { view: false, add: false, edit: false, delete: false },
  },
  {
    id: "bookings",
    name: "Bookings",
    description: "Manage customer tour reservations",
    icon: "confirmation_number",
    permissions: { view: false, add: false, edit: false, delete: false },
  },
  {
    id: "payments",
    name: "Payments",
    description: "Transaction history and payment processing",
    icon: "payments",
    permissions: { view: false, add: false, edit: false, delete: false },
  },
  {
    id: "manage_booking",
    name: "Manage Booking",
    description: "Post-booking modifications and services",
    icon: "edit_calendar",
    permissions: { view: false, add: false, edit: false, delete: false },
  },
  {
    id: "media",
    name: "Media",
    description: "Manage images and media assets",
    icon: "perm_media",
    permissions: { view: false, add: false, edit: false, delete: false },
  },
  {
    id: "routes",
    name: "Routes",
    description: "Flight route management",
    icon: "alt_route",
    permissions: { view: false, add: false, edit: false, delete: false },
  },
  {
    id: "airlines",
    name: "Airlines",
    description: "Manage airline partners",
    icon: "airlines",
    permissions: { view: false, add: false, edit: false, delete: false },
  },
  {
    id: "airports",
    name: "Airports",
    description: "Airport codes and locations",
    icon: "flight_takeoff",
    permissions: { view: false, add: false, edit: false, delete: false },
  },
  {
    id: "agencies",
    name: "Agencies",
    description: "B2B partner and agency data",
    icon: "domain",
    permissions: { view: false, add: false, edit: false, delete: false },
  },
  {
    id: "users",
    name: "Users",
    description: "System user management",
    icon: "group",
    permissions: { view: false, add: false, edit: false, delete: false },
  },
  {
    id: "services",
    name: "Services",
    description: "Additional services management",
    icon: "room_service",
    permissions: { view: false, add: false, edit: false, delete: false },
  },
  {
    id: "roles",
    name: "Roles & Permissions",
    description: "Manage system roles and access control",
    icon: "shield_person",
    permissions: { view: false, add: false, edit: false, delete: false },
  },
];

export const MOCK_ROLES: Role[] = [
  {
    id: "manager",
    name: "Manager",
    description: "Full system access",
    isSystem: true,
    modules: INITIAL_MODULES.map(m => ({
      ...m,
      permissions: { view: true, add: true, edit: true, delete: true }
    }))
  },
  {
    id: "staff",
    name: "Staff",
    description: "Operational tasks",
    isSystem: true,
    modules: INITIAL_MODULES.map(m => ({
      ...m,
      permissions: { view: true, add: true, edit: false, delete: false }
    }))
  },
  {
    id: "sales_agent",
    name: "Sales Agent",
    description: "Booking focus",
    isSystem: true,
    modules: INITIAL_MODULES.map(m => ({
      ...m,
      permissions: { 
        view: true, 
        add: m.id === 'bookings' || m.id === 'customers', 
        edit: m.id === 'bookings', 
        delete: false 
      }
    }))
  }
];
