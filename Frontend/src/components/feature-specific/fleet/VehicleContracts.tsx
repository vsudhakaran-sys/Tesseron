import { useState } from "react";
import { ChevronDown, ChevronRight, MoreVertical, Plus, FileText, Shield, Wrench, Car, Receipt } from "lucide-react";
import { Button } from "@/components/common/ui/button";
import { cn } from "@/utils/utils";

interface ContractField {
  label: string;
  value: string;
  isLink?: boolean;
}

interface ContractSection {
  title: string;
  fields: ContractField[];
}

interface Contract {
  id: string;
  type: "insurance" | "leasing" | "maintenance";
  title: string;
  vendor: string;
  status: "active" | "expiring" | "expired";
  sections: ContractSection[];
}

const contractsData: Contract[] = [
  {
    id: "1",
    type: "leasing",
    title: "Leasing Contract",
    vendor: "AutoLease Pro GmbH",
    status: "active",
    sections: [
      {
        title: "Contract Details",
        fields: [
          { label: "Contract Number", value: "LC-2024-00892" },
          { label: "Vendor", value: "AutoLease Pro GmbH", isLink: true },
          { label: "Start Date", value: "Jan 15, 2024" },
          { label: "End Date", value: "Jan 14, 2027" },
          { label: "Duration", value: "36 months" },
          { label: "Monthly Rate", value: "€ 485.00" },
        ],
      },
      {
        title: "Terms",
        fields: [
          { label: "Annual Mileage Limit", value: "20,000 km" },
          { label: "Excess Mileage Rate", value: "€ 0.12 / km" },
          { label: "Residual Value", value: "€ 18,500.00" },
          { label: "Down Payment", value: "€ 2,500.00" },
        ],
      },
    ],
  },
  {
    id: "2",
    type: "insurance",
    title: "Insurance Contract",
    vendor: "InsureFleet NL",
    status: "active",
    sections: [
      {
        title: "Policy Information",
        fields: [
          { label: "Policy Number", value: "INS-7823456" },
          { label: "Provider", value: "InsureFleet NL", isLink: true },
          { label: "Coverage Start", value: "Feb 1, 2024" },
          { label: "Coverage End", value: "Jan 31, 2025" },
          { label: "Amounts", value: "Net" },
        ],
      },
      {
        title: "Comprehensive Coverage",
        fields: [
          { label: "Annual Premium", value: "€ 680.00" },
          { label: "Monthly Premium", value: "€ 56.67" },
          { label: "Deductible", value: "€ 500.00" },
        ],
      },
      {
        title: "Liability Coverage",
        fields: [
          { label: "Annual Premium", value: "€ 420.00" },
          { label: "Monthly Premium", value: "€ 35.00" },
          { label: "Coverage Limit", value: "€ 100,000,000" },
        ],
      },
      {
        title: "Totals",
        fields: [
          { label: "Total Annual", value: "€ 1,100.00" },
          { label: "Total Monthly", value: "€ 91.67" },
        ],
      },
    ],
  },
  {
    id: "3",
    type: "maintenance",
    title: "Maintenance Contract",
    vendor: "FleetCare Services",
    status: "expiring",
    sections: [
      {
        title: "Service Agreement",
        fields: [
          { label: "Agreement ID", value: "MC-2024-1456" },
          { label: "Service Provider", value: "FleetCare Services", isLink: true },
          { label: "Valid From", value: "Mar 1, 2024" },
          { label: "Valid Until", value: "Feb 28, 2025" },
        ],
      },
      {
        title: "Coverage",
        fields: [
          { label: "Service Type", value: "Full Maintenance" },
          { label: "Includes Tires", value: "Yes" },
          { label: "Includes Brakes", value: "Yes" },
          { label: "Roadside Assistance", value: "24/7 Included" },
        ],
      },
      {
        title: "Pricing",
        fields: [
          { label: "Monthly Fee", value: "€ 125.00" },
          { label: "Annual Fee", value: "€ 1,500.00" },
          { label: "Per Service Visit", value: "Included" },
        ],
      },
    ],
  },
];

const invoicesData = [
  { id: "INV-2024-0892", date: "Jan 15, 2024", description: "Monthly Lease Payment", amount: "€ 485.00", status: "paid" },
  { id: "INV-2024-0756", date: "Jan 10, 2024", description: "Insurance Premium Q1", amount: "€ 275.00", status: "paid" },
  { id: "INV-2024-0634", date: "Dec 20, 2023", description: "Maintenance Service", amount: "€ 125.00", status: "paid" },
  { id: "INV-2024-0521", date: "Dec 15, 2023", description: "Monthly Lease Payment", amount: "€ 485.00", status: "paid" },
  { id: "INV-2024-0412", date: "Nov 28, 2023", description: "Tire Replacement", amount: "€ 340.00", status: "pending" },
];

const contractIcons = {
  insurance: Shield,
  leasing: Car,
  maintenance: Wrench,
};

const statusColors = {
  active: "text-success",
  expiring: "text-warning",
  expired: "text-destructive",
};

export function VehicleContracts() {
  const [expandedContracts, setExpandedContracts] = useState<string[]>(["1", "2"]);

  const toggleContract = (id: string) => {
    setExpandedContracts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Contracts Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Current Contracts</h3>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Contract
          </Button>
        </div>

        <div className="space-y-3">
          {contractsData.map((contract) => {
            const Icon = contractIcons[contract.type];
            const isExpanded = expandedContracts.includes(contract.id);

            return (
              <div
                key={contract.id}
                className="bg-card rounded-lg border border-border overflow-hidden"
              >
                {/* Contract Header */}
                <button
                  onClick={() => toggleContract(contract.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">{contract.title}</p>
                      <p className="text-sm text-muted-foreground">{contract.vendor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-xs font-medium capitalize", statusColors[contract.status])}>
                      {contract.status}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Contract Details */}
                {isExpanded && (
                  <div className="border-t border-border">
                    {contract.sections.map((section, sectionIndex) => (
                      <div key={section.title}>
                        {/* Section Header */}
                        <div className="px-4 py-2 bg-muted/40">
                          <p className="text-sm font-medium text-foreground">{section.title}</p>
                        </div>
                        {/* Section Fields */}
                        <div className="px-4 py-2 divide-y divide-border/50">
                          {section.fields.map((field) => (
                            <div key={field.label} className="flex justify-between py-2 text-sm">
                              <span className="text-muted-foreground">{field.label}</span>
                              {field.isLink ? (
                                <a href="#" className="text-primary hover:underline font-medium">
                                  {field.value}
                                </a>
                              ) : (
                                <span className="text-foreground font-medium">{field.value}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Invoices Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Invoices</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Invoice</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Description</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoicesData.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <a href="#" className="text-primary hover:underline font-mono text-xs">
                      {invoice.id}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{invoice.date}</td>
                  <td className="px-4 py-3 text-foreground">{invoice.description}</td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">{invoice.amount}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded text-xs font-medium",
                        invoice.status === "paid"
                          ? "bg-success/15 text-success"
                          : "bg-warning/15 text-warning"
                      )}
                    >
                      {invoice.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Documents Upload */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-foreground">Documents</h3>
          <Button variant="ghost" size="sm" className="text-primary">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Drop files here or <span className="text-primary">click to browse</span>
          </p>
        </div>
      </div>
    </div>
  );
}


