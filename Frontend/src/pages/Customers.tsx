import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/feature-specific/fleet/PageHeader";
import { Button } from "@/components/common/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import {
  CustomerToolbar,
  CustomersTable,
  initialCustomers,
  getCustomerCopy,
} from "@/components/feature-specific/customers";

export default function Customers() {
  const { locale } = useLanguage();
  const t = getCustomerCopy(locale);

  const navigate = useNavigate();

  // Snapshot the shared record store on mount; the page remounts after
  // create/edit/delete navigations, so the list always reflects the latest data.
  const [customers] = useState(() => [...initialCustomers]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.clientNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in relative">
      <PageHeader
        title={t.title}
        description={t.desc}
        actions={
          <Button onClick={() => navigate("/customers/new")} className="premium-button bg-primary text-primary-foreground hover:opacity-95 shadow-sm font-semibold tracking-wide text-xs h-9 px-4">
            <Plus className="h-4 w-4 mr-1.5 stroke-[2.5]" />
            {t.newCustomer}
          </Button>
        }
      />

      <CustomerToolbar
        t={t}
        locale={locale}
        totalCount={filteredCustomers.length}
        activeCount={filteredCustomers.filter(c => c.status === "Active").length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <CustomersTable
        customers={filteredCustomers}
        searchQuery={searchQuery}
        t={t}
        locale={locale}
        onEditCustomer={(c) => navigate(`/customers/${encodeURIComponent(c.clientNumber)}`)}
      />
    </div>
  );
}
