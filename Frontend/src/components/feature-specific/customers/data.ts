import type {
  Customer,
  InvitedUser,
  ModuleItem,
  CustomerDetails,
  CustomerOrg,
} from "./types";

// Mock Database Initial State
export const initialCustomers: Customer[] = [
  { name: "Nexus Logistics", clientNumber: "CLI-0822-XP", country: "Netherlands", currency: "EUR", tax: "Standard", fleetSize: 148, modulesCount: 3, createdDate: "2026-01-15", status: "Active" },
  { name: "Globex Inc", clientNumber: "CLI-0491-AB", country: "United States", currency: "USD", tax: "Exempt", fleetSize: 65, modulesCount: 4, createdDate: "2026-03-02", status: "Active" },
  { name: "Stark Industries", clientNumber: "CLI-0902-ST", country: "Germany", currency: "EUR", tax: "Reverse charge", fleetSize: 12, modulesCount: 3, createdDate: "2026-04-20", status: "Active" },
];

// Default fields when a fresh wizard is opened
export const defaultCustomerDetails: CustomerDetails = {
  customerName: "",
  clientNumber: "",
  country: "Netherlands",
  currency: "EUR",
  taxTreatment: "Standard",
};

// Seed user the wizard starts with
export const defaultInvitedUsers: InvitedUser[] = [
  { name: "David Miller", email: "david@nexuslogistics.com", role: "Admin", status: "Pending" },
];

// Available modules — core three enabled by default
export const defaultModules: ModuleItem[] = [
  { name: "Fleet & vehicles", desc: "Vehicle register, assignments, status", checked: true },
  { name: "Contracts & leasing", desc: "Lease contracts, suppliers, terms", checked: true },
  { name: "Reports & analytics", desc: "TCO, utilisation, cost-per-mile", checked: true },
  { name: "Damage & claims", desc: "Incident reports, insurer handling", checked: false },
  { name: "Maintenance", desc: "Service intervals, work orders", checked: false },
  { name: "Payroll / Benefit-in-kind", desc: "Company-car tax statements", checked: false },
];

// ─── Consolidated organisation overview (TESSERON Admin only) ─────────────────
// Sub-branch hierarchy + users (with role & status) per customer, keyed by
// client number. Looked up by the Customer Details drawer's Organisation tab.
const customerOrgByClient: Record<string, CustomerOrg> = {
  // Nexus Logistics
  "CLI-0822-XP": {
    branches: [
      {
        id: "nexus-hq",
        name: "Nexus Logistics HQ",
        location: "Amsterdam, Netherlands",
        userCount: 9,
        status: "Active",
        children: [
          { id: "nexus-north", name: "Nexus North", location: "Rotterdam, NL", userCount: 24, status: "Active" },
          { id: "nexus-south", name: "Nexus South", location: "Eindhoven, NL", userCount: 12, status: "Active" },
          { id: "nexus-cold", name: "Nexus Cold Chain", location: "Utrecht, NL", userCount: 5, status: "Inactive" },
        ],
      },
    ],
    users: [
      { id: "u-sophie", name: "Sophie van Dijk", email: "sophie@nexuslogistics.com", branch: "Nexus Logistics HQ", role: "Admin", status: "Active", avatarColor: 2, lastActive: "Just now" },
      { id: "u-liam", name: "Liam Bakker", email: "liam@nexuslogistics.com", branch: "Nexus North", role: "Fleet Manager", status: "Active", avatarColor: 1, lastActive: "3h ago" },
      { id: "u-emma", name: "Emma de Vries", email: "emma@nexuslogistics.com", branch: "Nexus South", role: "Manager", status: "Active", avatarColor: 4, lastActive: "1d ago" },
      { id: "u-julia", name: "Julia Smit", email: "julia@nexuslogistics.com", branch: "Nexus Logistics HQ", role: "Finance", status: "Active", avatarColor: 3, lastActive: "5h ago" },
      { id: "u-noah", name: "Noah Jansen", email: "noah@nexuslogistics.com", branch: "Nexus Cold Chain", role: "Viewer", status: "Inactive", avatarColor: 6, lastActive: "21d ago" },
      { id: "u-mila", name: "Mila Visser", email: "mila@nexuslogistics.com", branch: "Nexus North", role: "Viewer", status: "Pending", avatarColor: 5, lastActive: "—" },
    ],
  },
  // Globex Inc
  "CLI-0491-AB": {
    branches: [
      {
        id: "globex-corp",
        name: "Globex Corporate",
        location: "New York, USA",
        userCount: 7,
        status: "Active",
        children: [
          { id: "globex-west", name: "Globex West", location: "San Francisco, USA", userCount: 18, status: "Active" },
          { id: "globex-central", name: "Globex Central", location: "Chicago, USA", userCount: 9, status: "Active" },
        ],
      },
    ],
    users: [
      { id: "u-michael", name: "Michael Chen", email: "m.chen@globex.com", branch: "Globex Corporate", role: "Admin", status: "Active", avatarColor: 1, lastActive: "2h ago" },
      { id: "u-olivia", name: "Olivia Brown", email: "o.brown@globex.com", branch: "Globex West", role: "Manager", status: "Active", avatarColor: 3, lastActive: "6h ago" },
      { id: "u-james", name: "James Wilson", email: "j.wilson@globex.com", branch: "Globex Central", role: "Viewer", status: "Active", avatarColor: 5, lastActive: "1d ago" },
      { id: "u-ava", name: "Ava Martinez", email: "a.martinez@globex.com", branch: "Globex West", role: "Fleet Manager", status: "Inactive", avatarColor: 4, lastActive: "9d ago" },
    ],
  },
  // Stark Industries
  "CLI-0902-ST": {
    branches: [
      {
        id: "stark-gmbh",
        name: "Stark Industries GmbH",
        location: "Berlin, Germany",
        userCount: 4,
        status: "Active",
        children: [
          { id: "stark-rd", name: "Stark R&D", location: "Munich, DE", userCount: 6, status: "Active" },
        ],
      },
    ],
    users: [
      { id: "u-tony", name: "Tony Berger", email: "tony@stark-industries.de", branch: "Stark Industries GmbH", role: "Admin", status: "Active", avatarColor: 6, lastActive: "Just now" },
      { id: "u-pepper", name: "Pepper Klein", email: "pepper@stark-industries.de", branch: "Stark Industries GmbH", role: "Manager", status: "Active", avatarColor: 2, lastActive: "4h ago" },
      { id: "u-happy", name: "Happy Vogel", email: "happy@stark-industries.de", branch: "Stark R&D", role: "Viewer", status: "Inactive", avatarColor: 5, lastActive: "30d ago" },
    ],
  },
};

const EMPTY_ORG: CustomerOrg = { branches: [], users: [] };

// Org overview for a customer; returns an empty bundle for clients without
// seeded data (e.g. freshly onboarded customers).
export function getCustomerOrg(clientNumber: string): CustomerOrg {
  return customerOrgByClient[clientNumber] ?? EMPTY_ORG;
}

// ─── Shared customer record access ───────────────────────────────────────────
// The customer list and the detail page operate on this single in-memory array
// so edits made on one screen are visible on the other (prototype persistence).
export function getCustomerByClient(clientNumber: string): Customer | undefined {
  return initialCustomers.find((c) => c.clientNumber === clientNumber);
}

export function updateCustomerRecord(updated: Customer): void {
  const idx = initialCustomers.findIndex((c) => c.clientNumber === updated.clientNumber);
  if (idx >= 0) initialCustomers[idx] = updated;
}

export function addCustomerRecord(customer: Customer): void {
  initialCustomers.push(customer);
}

export function deleteCustomerRecord(clientNumber: string): void {
  const idx = initialCustomers.findIndex((c) => c.clientNumber === clientNumber);
  if (idx >= 0) initialCustomers.splice(idx, 1);
}


