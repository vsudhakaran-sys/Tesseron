// ─── Shared types for the Admin / Settings area ──────────────────────────────

export type AdminStatus = "Active" | "Invited" | "Disabled";

export type PermissionAction = "view" | "create" | "edit" | "delete" | "manage";

export const PERMISSION_ACTIONS: PermissionAction[] = [
  "view",
  "create",
  "edit",
  "delete",
  "manage",
];

// A functional area that permissions are granted against (one matrix row).
export interface PermissionArea {
  key: string;
  name: string;
  desc: string;
  // Which of the five actions actually apply to this area.
  applicable: PermissionAction[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  type: "System" | "Custom";
  // areaKey -> enabled actions for that area
  permissions: Record<string, PermissionAction[]>;
  userCount: number;
  updated: string; // display string, "—" when never edited
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  orgId: string;
  orgPath: string; // pretty display path, e.g. "Müller Germany › Sales Munich"
  roleIds: string[];
  status: AdminStatus;
  lastLogin: string; // display string
  mfa: boolean;
  language: string;
  avatarColor: number; // 1..6
}

export interface OrgNode {
  id: string;
  name: string;
  path: string; // dotted technical path
  users: number; // direct users
  country?: string;
  children?: OrgNode[];
}

export type AuditResult = "allow" | "deny";

export interface AuditEvent {
  id: string;
  time: string; // "2026-05-29 14:08"
  actorName: string;
  actorColor: number;
  action: string; // "user.invited"
  target: string;
  result: AuditResult;
}
