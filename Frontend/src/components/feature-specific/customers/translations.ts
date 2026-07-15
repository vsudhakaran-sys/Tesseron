// Locale-specific copy for the Customers feature.

export type Locale = "nl" | "en" | string;

export function getCustomerCopy(locale: Locale) {
  return locale === "nl"
    ? {
        title: "Klanten",
        desc: "Beheer uw klanten, gebruikers en geactiveerde modules.",
        searchPlaceholder: "Klant of land zoeken...",
        newCustomer: "Nieuwe Klant",
        tableHeaderName: "Klantnaam",
        tableHeaderClientId: "Klant ID",
        tableHeaderCountry: "Land",
        tableHeaderCurrency: "Valuta",
        tableHeaderTax: "Belastingbehandeling",
        tableHeaderFleet: "Voertuigen",
        tableHeaderModules: "Modules",
        tableHeaderCreated: "Geregistreerd",
        tableHeaderStatus: "Status",
        addCustomerTitle: "Klant toevoegen",
        addCustomerDesc: "Voeg een nieuwe klant toe via het stappenplan.",
        customerDetails: "Klantgegevens",
        usersAccess: "Gebruikers & Toegang",
        modules: "Modules",
        review: "Beoordelen",
        companyName: "Bedrijfsnaam",
        clientNumber: "Klantnummer",
        taxTreatment: "Belastingbehandeling",
        standard: "Standaard",
        exempt: "Vrijgesteld",
        reverseCharge: "Btw verlegd",
        fullName: "Volledige Naam",
        emailAddress: "E-mailadres",
        role: "Rol",
        inviteUser: "Gebruiker Uitnodigen",
        invitedUsers: "Uitgenodigde Gebruikers",
        noUsers: "Nog geen gebruikers uitgenodigd.",
        modulesDesc: "Activeer de gewenste modules voor deze klant.",
        reviewDetails: "Klantgegevens controleren",
        finishSetup: "Afronden",
        cancel: "Annuleren",
        continue: "Doorgaan",
        back: "Terug",
        invalidName: "Voer een geldige klantnaam in.",
        invalidEmail: "Voer een geldig e-mailadres in.",
        userAdded: "Uitnodiging voorbereid.",
        customerCreated: "Klant succesvol aangemaakt!",
        edit: "Bewerken",
        selectedModules: "Geselecteerde Modules",
        editCustomerTitle: "Klant bewerken",
        editCustomerDesc: "Wijzig de instellingen en gegevens van deze klant.",
        saveChanges: "Wijzigingen opslaan",
        customerUpdated: "Klant succesvol bijgewerkt!",
        statusActive: "Actief",
        statusInactive: "Inactief",
        statusPending: "In afwachting",
        // Organisatie & Gebruikers (alleen TESSERON-beheerder)
        tabDetails: "Gegevens",
        tabOrganisation: "Organisatie",
        TESSERONAdminOnly: "Alleen TESSERON-beheerder",
        orgOverviewTitle: "Organisatie & Gebruikers",
        subBranches: "Sub-vestigingen",
        orgUsers: "Gebruikers",
        branchesStat: "Vestigingen",
        usersStat: "Gebruikers",
        activeStat: "Actief",
        userSuffix: "gebruiker",
        usersSuffix: "gebruikers",
        noBranches: "Geen sub-vestigingen geregistreerd.",
        noOrgUsers: "Geen gebruikers gevonden voor deze organisatie.",
        deleteAction: "Verwijderen",
        deleteTitle: "Klant verwijderen?",
        deleteDesc: "Hiermee worden de klant en alle bijbehorende gegevens permanent verwijderd. Deze actie kan niet ongedaan worden gemaakt.",
        customerDeleted: "Klant verwijderd.",
      }
    : {
        title: "Customers",
        desc: "Manage your customers, client access, and enabled system modules.",
        searchPlaceholder: "Search customer or country...",
        newCustomer: "New Customer",
        tableHeaderName: "Customer Name",
        tableHeaderClientId: "Client ID",
        tableHeaderCountry: "Country",
        tableHeaderCurrency: "Currency",
        tableHeaderTax: "Tax Treatment",
        tableHeaderFleet: "Fleet Size",
        tableHeaderModules: "Modules",
        tableHeaderCreated: "Onboarded",
        tableHeaderStatus: "Status",
        addCustomerTitle: "Add new customer",
        addCustomerDesc: "Set up a new client using the onboarding wizard.",
        customerDetails: "Customer",
        usersAccess: "Users & Access",
        modules: "Modules",
        review: "Review",
        customerName: "Customer Name",
        clientNumber: "Client Number",
        taxTreatment: "Tax Treatment",
        standard: "Standard",
        exempt: "Exempt",
        reverseCharge: "Reverse charge",
        fullName: "Full Name",
        emailAddress: "Email Address",
        role: "Role",
        inviteUser: "Invite User",
        invitedUsers: "Users Invited",
        noUsers: "No users invited yet.",
        modulesDesc: "Toggle modules to enable features for this customer.",
        reviewDetails: "Review Customer Details",
        finishSetup: "Finish Setup",
        cancel: "Cancel",
        continue: "Continue",
        back: "Back",
        invalidName: "Please enter a valid Customer Name.",
        invalidEmail: "Please enter a valid email address.",
        userAdded: "Invitation prepared successfully.",
        customerCreated: "Customer created successfully!",
        edit: "Edit",
        selectedModules: "Selected Modules",
        editCustomerTitle: "Edit Customer",
        editCustomerDesc: "Modify settings and information for this client.",
        saveChanges: "Save Changes",
        customerUpdated: "Customer updated successfully!",
        statusActive: "Active",
        statusInactive: "Inactive",
        statusPending: "Pending",
        // Organisation & Users (TESSERON Admin only)
        tabDetails: "Details",
        tabOrganisation: "Organisation",
        TESSERONAdminOnly: "TESSERON Admin only",
        orgOverviewTitle: "Organisation & Users",
        subBranches: "Sub-branches",
        orgUsers: "Users",
        branchesStat: "Branches",
        usersStat: "Users",
        activeStat: "Active",
        userSuffix: "user",
        usersSuffix: "users",
        noBranches: "No sub-branches recorded.",
        noOrgUsers: "No users found for this organisation.",
        deleteAction: "Delete",
        deleteTitle: "Delete customer?",
        deleteDesc: "This permanently removes the customer and all associated data. This action cannot be undone.",
        customerDeleted: "Customer deleted.",
      };
}

export type CustomerCopy = ReturnType<typeof getCustomerCopy>;

export interface OnboardingTip {
  title: string;
  tips: string[];
}

export function getOnboardingTips(locale: Locale, step: number): OnboardingTip {
  const map: Record<0 | 1 | 2 | 3, OnboardingTip> =
    locale === "nl"
      ? {
          0: {
            title: "Richtlijnen voor klantgegevens",
            tips: [
              "Belastingbehandeling: 'Standaard' past nationale btw-regels toe. 'Vrijgesteld' is voor belastingvrije organisaties. 'Btw verlegd' verschuift de btw-plicht naar de klant.",
              "Klantnummer: Een unieke referentie voor facturatie. Indien leeg gelaten, wordt er automatisch een opeenvolgende code gegenereerd.",
              "Valuta: Dit bepaalt de standaardrapportagevaluta voor alle dashboards en kostenoverzichten.",
            ],
          },
          1: {
            title: "Rollen en toegangsniveaus",
            tips: [
              "Beheerder (Admin): Volledige toegang tot alle klantgegevens, instellingen, facturatie en teambeheer.",
              "Manager: Kan wagenparkgegevens bewerken en voertuigen toewijzen, maar heeft geen toegang tot de financiële instellingen.",
              "Lezer (Viewer): Alleen-lezen toegang tot dashboards en het voertuigenregister.",
            ],
          },
          2: {
            title: "Operationele modules",
            tips: [
              "Wagenpark, Contracten en Rapporten zijn standaard actief als basis van het fleetmanagementsysteem.",
              "Geavanceerde modules zoals Schadeclaims, Onderhoud en Salarisadministratie (bijtelling) kunnen op elk moment worden in- of uitgeschakeld.",
            ],
          },
          3: {
            title: "Afronding en activatie",
            tips: [
              "Directe activatie: Zodra u op 'Afronden' klikt, wordt het klantprofiel direct aangemaakt en actief.",
              "Uitnodigingen verzonden: Uitgenodigde gebruikers ontvangen onmiddellijk een e-mail om hun account te activeren.",
              "Aanpasbaar: U kunt de instellingen, modules en gebruikers naderhand altijd wijzigen via het klantendetailscherm.",
            ],
          },
        }
      : {
          0: {
            title: "Customer Profile Guidelines",
            tips: [
              "Tax Treatment: 'Standard' applies country-specific tax rules. 'Exempt' is for tax-free entities. 'Reverse charge' shifts tax liability to the customer's jurisdiction.",
              "Client Number: A unique reference for invoicing. If left empty, a sequential code will be generated automatically.",
              "Currency: Sets the default reporting currency for all operational dashboards and TCO charts.",
            ],
          },
          1: {
            title: "User Access & Roles",
            tips: [
              "Admin: Full read/write access to all customer data, user roles, system configurations, and billing info.",
              "Manager: Can edit fleet registry, assign drivers, and view reports, but cannot access system settings.",
              "Viewer: Read-only access to dashboards, reports, and vehicle registries.",
            ],
          },
          2: {
            title: "Modular Services",
            tips: [
              "Core fleet management modules (Fleet, Contracts, Reports) are enabled by default for all customer profiles.",
              "Advanced add-ons (Damage claims, Maintenance schedules, and Payroll statements) can be toggled on/off at any time as operational needs evolve.",
            ],
          },
          3: {
            title: "Completing Onboarding",
            tips: [
              "Instant Access: Clicking 'Finish Setup' immediately registers the client profile in the active tenant index.",
              "Email Dispatched: Invitation emails containing secure verification links are dispatched immediately to all added users.",
              "Post-Setup Editing: You can modify active modules, invite new users, or change details at any point from the details view.",
            ],
          },
        };

  return map[step as 0 | 1 | 2 | 3];
}


