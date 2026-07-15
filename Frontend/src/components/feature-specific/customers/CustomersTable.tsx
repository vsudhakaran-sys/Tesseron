import { Edit } from "lucide-react";
import { Button } from "@/components/common/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/ui/table";
import { HighlightText } from "./HighlightText";
import type { Customer } from "./types";
import type { CustomerCopy, Locale } from "./translations";

interface CustomersTableProps {
  customers: Customer[];
  searchQuery: string;
  t: CustomerCopy;
  locale: Locale;
  onEditCustomer: (customer: Customer) => void;
}

export function CustomersTable({ customers, searchQuery, t, locale, onEditCustomer }: CustomersTableProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-900 border-b border-border">
            <TableHead className="font-semibold text-[10px] text-muted-foreground tracking-wider py-3 px-5">{t.tableHeaderClientId}</TableHead>
            <TableHead className="font-semibold text-[10px] text-muted-foreground tracking-wider py-3 px-5">{t.tableHeaderName}</TableHead>
            <TableHead className="font-semibold text-[10px] text-muted-foreground tracking-wider py-3 px-5">{t.tableHeaderCountry}</TableHead>
            <TableHead className="font-semibold text-[10px] text-muted-foreground tracking-wider py-3 px-5">{t.tableHeaderFleet}</TableHead>
            <TableHead className="font-semibold text-[10px] text-muted-foreground tracking-wider py-3 px-5">{t.tableHeaderModules}</TableHead>
            <TableHead className="font-semibold text-[10px] text-muted-foreground tracking-wider py-3 px-5">{t.tableHeaderCreated}</TableHead>
            <TableHead className="font-semibold text-[10px] text-muted-foreground tracking-wider py-3 px-5">{t.tableHeaderStatus}</TableHead>
            <TableHead className="font-semibold text-[10px] text-muted-foreground tracking-wider py-3 px-5 text-right pr-6">{t.edit}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((cust, idx) => {
            const initials = cust.name
              .split(" ")
              .map(w => w[0])
              .slice(0, 2)
              .join("");
            return (
              <TableRow
                key={`${cust.name}-${idx}`}
                className="hover:bg-primary/[0.02] dark:hover:bg-primary/[0.04] transition-colors border-b border-border last:border-0 cursor-pointer"
                onClick={() => onEditCustomer(cust)}
              >
                <TableCell className="py-3.5 px-5 text-xs font-mono font-semibold text-foreground">
                  <HighlightText text={cust.clientNumber} query={searchQuery} />
                </TableCell>
                <TableCell className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/50 border border-blue-100 dark:border-blue-800 flex items-center justify-center font-bold text-xs text-primary">
                      {initials}
                    </div>
                    <span className="font-medium text-foreground text-sm">
                      <HighlightText text={cust.name} query={searchQuery} />
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3.5 px-5 text-muted-foreground text-xs font-medium">
                  <HighlightText text={cust.country} query={searchQuery} />
                </TableCell>
                <TableCell className="py-3.5 px-5 text-foreground text-xs font-semibold">
                  {cust.fleetSize} {cust.fleetSize === 1 ? (locale === "nl" ? "voertuig" : "vehicle") : (locale === "nl" ? "voertuigen" : "vehicles")}
                </TableCell>
                <TableCell className="py-3.5 px-5 text-muted-foreground text-xs font-medium">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                    {cust.modulesCount} {locale === "nl" ? "actief" : "active"}
                  </span>
                </TableCell>
                <TableCell className="py-3.5 px-5 text-foreground text-xs font-medium">{cust.createdDate}</TableCell>
                <TableCell className="py-3.5 px-5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${
                    cust.status === "Active"
                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border-emerald-100 dark:border-emerald-900/50"
                      : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 border-rose-100 dark:border-rose-900/50"
                  }`}>
                    {cust.status === "Active" ? (locale === "nl" ? "Actief" : "Active") : (locale === "nl" ? "Inactief" : "Inactive")}
                  </span>
                </TableCell>
                <TableCell className="py-3.5 px-5 text-right pr-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditCustomer(cust)}
                    className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-all duration-200"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
