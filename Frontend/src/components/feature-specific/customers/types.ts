// Shared types for the Customers feature

export interface Customer {
  name: string;
  clientNumber: string;
  country: string;
  currency: string;
  tax: string;
  fleetSize: number;
  modulesCount: number;
  createdDate: string;
  status: string;
}

export interface InvitedUser {
  name: string;
  email: string;
  role: string;
  status: string;
}

// ─── Organisation overview (TESSERON Admin consolidated view) ─────────────────
export type OrgEntityStatus = "Active" | "Inactive" | "Pending";

// A sub-branch / division within a customer organisation. May nest.
export interface CustomerBranch {
  id: string;
  name: string;
  location: string; // city / country shown under the name
  userCount: number;
  status: Extract<OrgEntityStatus, "Active" | "Inactive">;
  children?: CustomerBranch[];
}

// A user belonging to the customer organisation, with their assigned role.
export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  branch: string; // branch the user sits in
  role: string; // Admin / Manager / Fleet Manager / Viewer …
  status: OrgEntityStatus;
  avatarColor?: number; // 1..6 palette index
  lastActive?: string;
}

// Bundle attached to a customer for the consolidated overview.
export interface CustomerOrg {
  branches: CustomerBranch[];
  users: CustomerUser[];
}

export interface ModuleItem {
  name: string;
  desc: string;
  checked: boolean;
}

// Step 1 customer detail fields, grouped for tidy prop passing
export interface CustomerDetails {
  customerName: string;
  clientNumber: string;
  country: string;
  currency: string;
  taxTreatment: string;
}


