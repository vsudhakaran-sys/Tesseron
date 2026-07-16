// Locale-specific copy for the Admin / Settings area.
// Mirrors the pattern used by the Customers feature (getCustomerCopy).

export type Locale = "nl" | "en" | string;

export function getAdminCopy(locale: Locale) {
  const nl = locale === "nl";
  return {
    // Page shell
    title: nl ? "Beheer & Instellingen" : "Administration & Settings",
    desc: nl
      ? "Beheer gebruikers, rollen, organisaties en systeeminstellingen."
      : "Manage users, roles, organizations, and system configuration.",

    // Settings-nav section headers
    secAccount: nl ? "Account" : "Account",
    secAdmin: nl ? "Beheer" : "Administration",
    secFleet: nl ? "Wagenparkconfiguratie" : "Fleet configuration",

    // Settings-nav item labels
    navGeneral: nl ? "Algemeen" : "General",
    navAccount: nl ? "Mijn profiel" : "My Profile",
    navUsers: nl ? "Gebruikers" : "Users",
    navRoles: nl ? "Rollen & rechten" : "Roles & permissions",
    navOrganizations: nl ? "Organisaties" : "Organizations",
    navAudit: nl ? "Auditlogboek" : "Audit log",
    navLeasing: nl ? "Leasing" : "Leasing",
    navInsurance: nl ? "Verzekering" : "Insurance",
    navFuelCards: nl ? "Tankkaartaanbieders" : "Fuel card providers",
    navCostTypes: nl ? "Kostentypes" : "Cost types",
    navCustomFields: nl ? "Aangepaste velden" : "Custom fields",
    navDepreciation: nl ? "Afschrijvingsschema's" : "Depreciation schedules",
    navFolders: nl ? "Mappen" : "Folders",
    navTaskTemplates: nl ? "Taaksjablonen" : "Task templates",
    navHrIntegrations: nl ? "HR-integraties" : "HR integrations",
    navOwnerEmails: nl ? "Eigenaar e-mails" : "Owner emails",
    navInvoices: nl ? "Facturen" : "Invoices",

    // Common
    search: nl ? "Zoeken…" : "Search…",
    cancel: nl ? "Annuleren" : "Cancel",
    save: nl ? "Opslaan" : "Save changes",
    back: nl ? "Terug" : "Back",
    edit: nl ? "Bewerken" : "Edit",
    create: nl ? "Aanmaken" : "Create",
    allOrgs: nl ? "Alle organisaties" : "All organizations",
    allRoles: nl ? "Alle rollen" : "All roles",
    allStatuses: nl ? "Alle statussen" : "All statuses",
    statusActive: nl ? "Actief" : "Active",
    statusInvited: nl ? "Uitgenodigd" : "Invited",
    statusDisabled: nl ? "Uitgeschakeld" : "Disabled",
    optional: nl ? "optioneel" : "optional",
    required: nl ? "verplicht" : "required",

    // Users
    usersTitle: nl ? "Alle gebruikers" : "All users",
    usersDesc: nl
      ? "Iedereen met toegang. Filter op organisatie of rol; klik op een rij om te beheren."
      : "Everyone with access. Filter by organization or role; click a row to manage.",
    inviteUser: nl ? "Gebruiker uitnodigen" : "Invite user",
    colUser: nl ? "Gebruiker" : "User",
    colOrg: nl ? "Organisatie" : "Organization",
    colRoles: nl ? "Rollen" : "Roles",
    colStatus: nl ? "Status" : "Status",
    colLastLogin: nl ? "Laatste login" : "Last login",
    usersCount: (n: number) => (nl ? `${n} gebruikers` : `${n} users`),
    noUsers: nl ? "Geen gebruikers gevonden." : "No users match the filters.",

    // User detail
    profile: nl ? "Profiel" : "Profile",
    access: nl ? "Toegang" : "Access",
    fullName: nl ? "Volledige naam" : "Full name",
    email: nl ? "E-mail" : "Email",
    defaultLanguage: nl ? "Standaardtaal" : "Default language",
    organization: nl ? "Organisatie" : "Organization",
    moveOrgHelp: nl ? "Verplaats deze gebruiker naar een andere organisatie" : "Move this user to a different organization",
    assignedRoles: nl ? "Toegewezen rollen" : "Assigned roles",
    rolesHelp: nl ? "Een gebruiker kan meerdere rollen hebben · rechten worden gecombineerd" : "A user can hold multiple roles · permissions accumulate",
    effectiveAccess: nl ? "Effectieve toegang" : "Effective access summary",
    permissions: nl ? "Rechten" : "Permissions",
    scope: nl ? "Bereik" : "Scope",
    wholeOrg: nl ? "Hele organisatie" : "Whole organization",
    mfa: nl ? "MFA" : "MFA",
    verified: nl ? "Geverifieerd" : "Verified",
    notEnrolled: nl ? "Niet ingesteld" : "Not enrolled",
    resetPassword: nl ? "Wachtwoord resetten" : "Reset password",
    forceMfa: nl ? "MFA opnieuw afdwingen" : "Force MFA re-enrol",
    disable: nl ? "Uitschakelen" : "Disable",
    enable: nl ? "Inschakelen" : "Enable",

    // Invite modal
    inviteTitle: nl ? "Nieuwe gebruiker uitnodigen" : "Invite a new user",
    workEmail: nl ? "Werk-e-mail" : "Work email",
    rolesOneOrMore: nl ? "Rollen (één of meer)" : "Roles (one or more)",
    inviteRolesHelp: nl ? "Een gebruiker kan meerdere rollen hebben. Rechten worden gecombineerd." : "A user can hold multiple roles. Permissions accumulate across roles.",
    inviteNote: nl
      ? "Bij uitnodiging wordt een Keycloak-account aangemaakt en een activatie-e-mail verzonden. De gebruiker stelt het wachtwoord in en registreert MFA vóór de eerste login."
      : "On invite, a Keycloak account is created and an activation email is sent. The user sets their password and registers MFA before first login.",
    sendInvite: nl ? "Uitnodiging versturen" : "Send invite",
    inviteSent: nl ? "Uitnodiging voorbereid." : "Invitation prepared.",

    // Roles
    rolesTitle: nl ? "Rollen & rechten" : "Roles & permissions",
    rolesDesc: nl
      ? "Rollen zijn globaal — één keer gedefinieerd en overal gebruikt. Klik op een rol om de rechten te bewerken."
      : "Roles are global — defined once and used across every organization. Click a role to edit its permissions.",
    createRole: nl ? "Rol aanmaken" : "Create role",
    newRole: nl ? "Nieuwe rol" : "New role",
    roleCreated: nl ? "Rol aangemaakt." : "Role created.",
    roleNameRequired: nl ? "Voer een rolnaam in." : "Enter a role name.",
    colRole: nl ? "Rol" : "Role",
    colType: nl ? "Type" : "Type",
    colPermissions: nl ? "Rechten" : "Permissions",
    colUsers: nl ? "Gebruikers" : "Users",
    colUpdated: nl ? "Laatst gewijzigd" : "Last updated",
    typeSystem: nl ? "Systeem" : "System",
    typeCustom: nl ? "Aangepast" : "Custom",

    // Role detail / matrix
    permMatrix: nl ? "Rechtenmatrix" : "Permissions matrix",
    enabledOfTotal: (n: number, total: number) => (nl ? `${n} van ${total} ingeschakeld` : `${n} of ${total} enabled`),
    presetReadOnly: nl ? "Alleen lezen" : "Read-only",
    presetFull: nl ? "Volledige toegang" : "Full access",
    presetClear: nl ? "Wissen" : "Clear",
    colArea: nl ? "Gebied" : "Area",
    actView: nl ? "Bekijken" : "View",
    actCreate: nl ? "Aanmaken" : "Create",
    actEdit: nl ? "Bewerken" : "Edit",
    actDelete: nl ? "Verwijderen" : "Delete",
    actManage: nl ? "Beheren" : "Manage",
    savePermissions: nl ? "Rechten opslaan" : "Save permissions",
    usersWithRole: (n: number) => (nl ? `Gebruikers met deze rol · ${n}` : `Users with this role · ${n}`),
    roleMetadata: nl ? "Rolgegevens" : "Role metadata",
    roleName: nl ? "Rolnaam" : "Role name",
    description: nl ? "Beschrijving" : "Description",
    systemRoleNote: nl ? "Systeemrollen kunnen niet worden verwijderd, maar rechten kunnen wel worden bewerkt." : "System roles cannot be deleted, but permissions can be edited.",
    headsUp: nl ? "Let op:" : "Heads-up:",
    roleImpact: (n: number) => (nl ? `wijzigingen aan rechten raken alle ${n} gebruikers direct.` : `changing permissions affects all ${n} users immediately.`),

    // Organizations
    orgsTitle: nl ? "Organisatiestructuur" : "Organization tree",
    orgsDesc: nl
      ? "De volledige hiërarchie. Klik op een knooppunt om de gebruikers te zien; maak op elk niveau sub-organisaties aan."
      : "The full hierarchy. Click any node to see its users; create sub-organizations at any level.",
    newSubOrg: nl ? "Nieuwe sub-organisatie" : "New sub-organization",
    hierarchy: nl ? "Hiërarchie" : "Hierarchy",
    clickToDrill: nl ? "klik om in te zoomen" : "click to drill in",
    directUsers: nl ? "Directe gebruikers" : "Direct users",
    subOrgs: nl ? "Sub-organisaties" : "Sub-organizations",
    members: nl ? "Leden" : "Members",
    addSubHere: nl ? "+ Sub-org hier toevoegen" : "+ Add sub-org here",
    createSubOrg: nl ? "Sub-organisatie aanmaken" : "Create a sub-organization",
    name: nl ? "Naam" : "Name",
    parentOrg: nl ? "Bovenliggende organisatie" : "Parent organization",
    country: nl ? "Land" : "Country",
    countryNone: nl ? "— geen —" : "— none —",
    orgCreated: nl ? "Sub-organisatie aangemaakt." : "Sub-organization created.",

    // Audit
    auditTitle: nl ? "Administratieve activiteit" : "Administrative activity",
    auditDesc: nl
      ? "Elke administratieve actie wordt hier vastgelegd, append-only, met de actor, het doel en het resultaat."
      : "Every administrative action is recorded here, append-only, with the actor, target, and result.",
    exportCsv: nl ? "Exporteer CSV" : "Export CSV",
    allActors: nl ? "Alle actoren" : "All actors",
    allActions: nl ? "Alle acties" : "All actions",
    last24h: nl ? "Laatste 24 uur" : "Last 24 hours",
    last7d: nl ? "Laatste 7 dagen" : "Last 7 days",
    last30d: nl ? "Laatste 30 dagen" : "Last 30 days",
    colTime: nl ? "Tijd" : "Time",
    colActor: nl ? "Actor" : "Actor",
    colAction: nl ? "Actie" : "Action",
    colTarget: nl ? "Doel" : "Target",
    colResult: nl ? "Resultaat" : "Result",
    eventsCount: (n: number) => (nl ? `${n} gebeurtenissen` : `${n} events`),
    resultAllow: nl ? "toegestaan" : "allow",
    resultDeny: nl ? "geweigerd" : "deny",

    // General settings
    generalTitle: nl ? "Algemene instellingen" : "General settings",
    generalDesc: nl ? "Organisatiebrede standaarden voor het TESSERON-platform." : "Organization-wide defaults for the TESSERON platform.",
    orgDisplayName: nl ? "Weergavenaam organisatie" : "Organization display name",
    primaryContact: nl ? "Primair contact" : "Primary contact",
    baseCurrency: nl ? "Basisvaluta" : "Base currency",
    timezone: nl ? "Tijdzone" : "Timezone",
    dateFormat: nl ? "Datumnotatie" : "Date format",
    orgSection: nl ? "Organisatie" : "Organization",
    localization: nl ? "Regio & opmaak" : "Region & formats",

    // My Profile (merged Profile + Security & MFA + Preferences)
    accountTitle: nl ? "Mijn profiel" : "My Profile",
    accountDesc: nl
      ? "Beheer uw profiel, beveiliging en persoonlijke voorkeuren op één plek."
      : "Manage your profile, security, and personal preferences in one place.",
    profileTitle: nl ? "Profiel" : "Profile",
    securityTitle: nl ? "Beveiliging" : "Security",
    securityHandled: nl ? "beheerd door Keycloak" : "handled by Keycloak",
    password: nl ? "Wachtwoord" : "Password",
    passwordChanged: nl ? "14 dagen geleden gewijzigd" : "Last changed 14 days ago",
    changePassword: nl ? "Wachtwoord wijzigen" : "Change password",
    mfaLabel: nl ? "Multi-factor authenticatie" : "Multi-factor authentication",
    mfaEnrolled: nl ? "Authenticator-app · ingesteld" : "Authenticator app · enrolled",
    passkey: nl ? "Passkey (WebAuthn)" : "Passkey (WebAuthn)",
    passkeyDesc: nl ? "Aanbevolen voor phishingbestendige login" : "Recommended for phishing-resistant login",
    addPasskey: nl ? "Passkey toevoegen" : "Add passkey",
    recoveryCodes: nl ? "Herstelcodes" : "Recovery codes",
    recoveryDesc: nl ? "8 codes gegenereerd · 8 ongebruikt" : "8 codes generated · 8 unused",
    viewCodes: nl ? "Codes bekijken" : "View codes",
    preferencesTitle: nl ? "Voorkeuren" : "Preferences",
    landingPage: nl ? "Standaard landingspagina" : "Default landing page",
    landingDesc: nl ? "Waar u terechtkomt na het inloggen" : "Where you land after login",
    emailNotifs: nl ? "E-mailnotificaties" : "Email notifications",
    emailNotifsDesc: nl ? "Ontvang meldingen van beheeracties in uw organisatie" : "Get notified of admin actions in your org",
    weeklyDigest: nl ? "Wekelijks activiteitsoverzicht" : "Weekly activity digest",
    weeklyDigestDesc: nl ? "Samenvatting van wijzigingen elke maandag" : "Summary of changes every Monday",

    // Scaffold placeholder
    comingSoon: nl ? "Binnenkort beschikbaar" : "Coming soon",
    scaffoldNote: nl
      ? "Dit configuratiescherm is opgezet maar nog niet ingevuld. De navigatie en structuur staan klaar — vraag om dit scherm verder uit te werken."
      : "This configuration screen is scaffolded but not yet built out. The navigation and structure are in place — ask to flesh this screen out.",
  };
}

export type AdminCopy = ReturnType<typeof getAdminCopy>;


