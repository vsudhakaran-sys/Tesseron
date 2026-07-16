import type {
  AdminUser,
  AuditEvent,
  OrgNode,
  PermissionArea,
  Role,
} from "./types";

// ─── Permission areas (matrix rows) ──────────────────────────────────────────
// `applicable` controls which of the 5 action columns render an editable box.
export const PERMISSION_AREAS: PermissionArea[] = [
  { key: "dashboard", name: "Dashboard", desc: "Home overview", applicable: ["view"] },
  { key: "organizations", name: "Organizations", desc: "Sub-org tree, settings", applicable: ["view", "create", "edit", "delete"] },
  { key: "users", name: "Users", desc: "People & their access", applicable: ["view", "create", "edit", "delete"] },
  { key: "roles", name: "Roles", desc: "Definitions & permissions", applicable: ["view", "create", "edit", "delete"] },
  { key: "vehicles", name: "Vehicles", desc: "Fleet master", applicable: ["view", "create", "edit", "delete", "manage"] },
  { key: "drivers", name: "Drivers", desc: "Driver records", applicable: ["view", "create", "edit", "manage"] },
  { key: "contracts", name: "Contracts", desc: "Leasing & agreements", applicable: ["view", "create", "edit"] },
  { key: "maintenance", name: "Maintenance", desc: "Work orders & service", applicable: ["view"] },
  { key: "reports", name: "Reports", desc: "TCO, utilisation", applicable: ["view"] },
  { key: "audit", name: "Audit log", desc: "View admin activity", applicable: ["view"] },
];

// Total grantable permissions across every area (used for "X / N" displays).
export const TOTAL_PERMISSIONS = PERMISSION_AREAS.reduce(
  (sum, a) => sum + a.applicable.length,
  0,
);

// Convenience: every applicable action for every area (a full-access role).
function allPermissions(): Record<string, string[]> {
  return Object.fromEntries(PERMISSION_AREAS.map((a) => [a.key, [...a.applicable]]));
}

export function countPermissions(role: Role): number {
  return Object.values(role.permissions).reduce((sum, acts) => sum + acts.length, 0);
}

// ─── Roles ───────────────────────────────────────────────────────────────────
export const initialRoles: Role[] = [
  {
    id: "administrator",
    name: "Administrator",
    description: "Full system access · cannot be deleted",
    type: "System",
    permissions: allPermissions() as Role["permissions"],
    userCount: 1,
    updated: "—",
  },
  {
    id: "fleet-manager",
    name: "FleetManager",
    description: "Manages vehicles, drivers, contracts",
    type: "System",
    permissions: {
      dashboard: ["view"],
      vehicles: ["view", "create", "edit", "delete", "manage"],
      drivers: ["view", "create", "edit", "manage"],
      contracts: ["view", "create", "edit"],
      reports: ["view"],
    },
    userCount: 3,
    updated: "2 days ago",
  },
  {
    id: "hr",
    name: "HR",
    description: "Driver records, training, licences",
    type: "System",
    permissions: {
      dashboard: ["view"],
      users: ["view"],
      drivers: ["view", "create", "edit", "manage"],
      contracts: ["view"],
      maintenance: ["view"],
      reports: ["view"],
    },
    userCount: 2,
    updated: "1 week ago",
  },
  {
    id: "finance",
    name: "Finance",
    description: "Invoices, contracts, accounting",
    type: "System",
    permissions: {
      dashboard: ["view"],
      organizations: ["view"],
      users: ["view"],
      vehicles: ["view"],
      drivers: ["view"],
      contracts: ["view", "create", "edit"],
      maintenance: ["view"],
      reports: ["view"],
    },
    userCount: 4,
    updated: "3 days ago",
  },
  {
    id: "controlling",
    name: "Controlling",
    description: "Reports, analytics, cost centres",
    type: "System",
    permissions: {
      dashboard: ["view"],
      organizations: ["view"],
      users: ["view"],
      vehicles: ["view"],
      drivers: ["view"],
      contracts: ["view"],
      reports: ["view"],
      audit: ["view"],
    },
    userCount: 1,
    updated: "—",
  },
  {
    id: "driver",
    name: "Driver",
    description: "Self-service · own vehicle only",
    type: "System",
    permissions: {
      dashboard: ["view"],
      vehicles: ["view"],
      drivers: ["view"],
      maintenance: ["view"],
      reports: ["view"],
    },
    userCount: 9,
    updated: "—",
  },
  {
    id: "junior-consultant",
    name: "JuniorConsultant",
    description: "Read-only across permitted areas",
    type: "Custom",
    permissions: {
      dashboard: ["view"],
      organizations: ["view"],
      users: ["view"],
      vehicles: ["view"],
      drivers: ["view"],
      contracts: ["view"],
      reports: ["view"],
    },
    userCount: 2,
    updated: "3 hours ago",
  },
  {
    id: "custom-reports-viewer",
    name: "CustomReportsViewer",
    description: "Read access to reports module only",
    type: "Custom",
    permissions: {
      dashboard: ["view"],
      vehicles: ["view"],
      reports: ["view"],
      audit: ["view"],
    },
    userCount: 1,
    updated: "1 day ago",
  },
];

// ─── Organization tree ───────────────────────────────────────────────────────
export const orgTree: OrgNode[] = [
  {
    id: "mueller-holding",
    name: "Müller Holding GmbH",
    path: "mueller-holding",
    users: 5,
    children: [
      {
        id: "mueller-de",
        name: "Müller Germany",
        path: "mueller-de",
        users: 6,
        country: "Germany",
        children: [
          { id: "mueller-de.munich", name: "Sales Munich", path: "mueller-de.munich", users: 3, country: "Germany" },
          { id: "mueller-de.hamburg", name: "Sales Hamburg", path: "mueller-de.hamburg", users: 2, country: "Germany" },
          { id: "mueller-de.ops", name: "Operations DE", path: "mueller-de.ops", users: 2, country: "Germany" },
        ],
      },
      {
        id: "mueller-fr",
        name: "Müller France",
        path: "mueller-fr",
        users: 3,
        country: "France",
        children: [
          { id: "mueller-fr.paris", name: "Sales Paris", path: "mueller-fr.paris", users: 2, country: "France" },
        ],
      },
      { id: "mueller-ch", name: "Müller Switzerland", path: "mueller-ch", users: 2, country: "Switzerland" },
    ],
  },
];

// Flattened {id,label} list for org dropdowns (indentation preserved).
export function flattenOrgs(nodes: OrgNode[] = orgTree, depth = 0): { id: string; label: string }[] {
  return nodes.flatMap((n) => [
    { id: n.id, label: `${"  ".repeat(depth)}${depth > 0 ? "› " : ""}${n.name}` },
    ...(n.children ? flattenOrgs(n.children, depth + 1) : []),
  ]);
}

// ─── Users ───────────────────────────────────────────────────────────────────
export const initialUsers: AdminUser[] = [
  { id: "anna", name: "Anna Müller", email: "anna.mueller@mueller.de", orgId: "mueller-holding", orgPath: "Müller Holding (root)", roleIds: ["administrator"], status: "Active", lastLogin: "Just now", mfa: true, language: "de-DE", avatarColor: 3 },
  { id: "klaus", name: "Klaus Berger", email: "klaus.berger@mueller.de", orgId: "mueller-de.munich", orgPath: "Müller Germany › Sales Munich", roleIds: ["fleet-manager"], status: "Active", lastLogin: "6h ago", mfa: true, language: "de-DE", avatarColor: 1 },
  { id: "sophie", name: "Sophie Laurent", email: "sophie.laurent@mueller.fr", orgId: "mueller-fr", orgPath: "Müller France", roleIds: ["finance"], status: "Invited", lastLogin: "—", mfa: false, language: "fr-FR", avatarColor: 2 },
  { id: "marco", name: "Marco Rossi", email: "marco.rossi@mueller.ch", orgId: "mueller-ch", orgPath: "Müller Switzerland", roleIds: ["fleet-manager"], status: "Active", lastLogin: "1d ago", mfa: true, language: "de-DE", avatarColor: 4 },
  { id: "hans", name: "Hans Schmidt", email: "hans.schmidt@mueller.de", orgId: "mueller-de.munich", orgPath: "Müller Germany › Sales Munich", roleIds: ["driver"], status: "Active", lastLogin: "3h ago", mfa: true, language: "de-DE", avatarColor: 5 },
  { id: "lukas", name: "Lukas Hansen", email: "lukas.hansen@mueller.de", orgId: "mueller-holding", orgPath: "Müller Holding (root)", roleIds: ["junior-consultant"], status: "Active", lastLogin: "2d ago", mfa: true, language: "en-GB", avatarColor: 2 },
  { id: "thomas", name: "Thomas Becker", email: "thomas.becker@mueller.de", orgId: "mueller-holding", orgPath: "Müller Holding (root)", roleIds: ["controlling"], status: "Active", lastLogin: "4h ago", mfa: true, language: "de-DE", avatarColor: 5 },
  { id: "petra", name: "Petra Huber", email: "petra.huber@mueller.de", orgId: "mueller-de", orgPath: "Müller Germany", roleIds: ["hr"], status: "Disabled", lastLogin: "14d ago", mfa: false, language: "de-DE", avatarColor: 6 },
];

// ─── Audit log ───────────────────────────────────────────────────────────────
export const auditEvents: AuditEvent[] = [
  { id: "a1", time: "2026-05-29 14:08", actorName: "Anna Müller", actorColor: 3, action: "user.invited", target: "sophie.laurent@mueller.fr · Müller France", result: "allow" },
  { id: "a2", time: "2026-05-29 13:02", actorName: "Anna Müller", actorColor: 3, action: "role.permissions.updated", target: "JuniorConsultant · +reports.view", result: "allow" },
  { id: "a3", time: "2026-05-29 11:14", actorName: "Anna Müller", actorColor: 3, action: "subOrg.created", target: "Müller Switzerland · parent: Müller Holding", result: "allow" },
  { id: "a4", time: "2026-05-29 10:31", actorName: "Klaus Berger", actorColor: 1, action: "auth.login", target: "OIDC · MFA verified · Munich", result: "allow" },
  { id: "a5", time: "2026-05-29 09:18", actorName: "Anna Müller", actorColor: 3, action: "user.org_changed", target: "Hans Schmidt · Operations DE → Sales Munich", result: "allow" },
  { id: "a6", time: "2026-05-28 16:44", actorName: "Anna Müller", actorColor: 3, action: "role.created", target: "CustomReportsViewer · 4 permissions", result: "allow" },
  { id: "a7", time: "2026-05-28 14:22", actorName: "Sophie Laurent", actorColor: 2, action: "auth.login_failed", target: "OIDC · wrong MFA code · Paris", result: "deny" },
  { id: "a8", time: "2026-05-28 11:09", actorName: "Anna Müller", actorColor: 3, action: "user.disabled", target: "petra.huber@mueller.de", result: "allow" },
];
