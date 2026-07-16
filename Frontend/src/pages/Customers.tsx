import { useEffect, useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.clientNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * 8;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + 8);
  const totalPages = Math.ceil(filteredCustomers.length / 8);

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
        customers={paginatedCustomers}
        searchQuery={searchQuery}
        t={t}
        locale={locale}
        onEditCustomer={(c) => navigate(`/customers/${encodeURIComponent(c.clientNumber)}`)}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between py-2 text-xs text-muted-foreground">
          <p>
            Showing <span className="font-semibold text-foreground">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-foreground">
              {Math.min(startIndex + 8, filteredCustomers.length)}
            </span>{" "}
            of <span className="font-semibold text-foreground">{filteredCustomers.length}</span> {locale === "nl" ? "klanten" : "customers"}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-[11px] font-semibold"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-[11px] font-semibold"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
