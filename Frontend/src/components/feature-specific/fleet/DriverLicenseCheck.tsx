import { Button } from "@/components/common/ui/button";
import { Badge } from "@/components/common/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/ui/table";
import {
  IdCard,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Upload,
  Eye,
  Plus,
  ShieldCheck,
} from "lucide-react";

const licenseChecks = [
  { id: 1, driver: "GP Sky", licenseNumber: "DL-2024-78542", licenseClass: "B, BE", issueDate: "Mar 15, 2020", expiryDate: "Mar 14, 2030", lastCheck: "Jan 15, 2026", nextCheck: "Apr 15, 2026", status: "valid" as const, checkResult: "Passed" },
  { id: 2, driver: "Maria Santos", licenseNumber: "DL-2022-45123", licenseClass: "B", issueDate: "Jun 20, 2022", expiryDate: "Jun 19, 2032", lastCheck: "Dec 10, 2025", nextCheck: "Mar 10, 2026", status: "valid" as const, checkResult: "Passed" },
  { id: 3, driver: "John Mitchell", licenseNumber: "DL-2019-32156", licenseClass: "B, C1", issueDate: "Aug 05, 2019", expiryDate: "Aug 04, 2029", lastCheck: "Nov 20, 2025", nextCheck: "Feb 20, 2026", status: "due" as const, checkResult: "Pending" },
  { id: 4, driver: "Emma Wilson", licenseNumber: "DL-2021-65478", licenseClass: "B", issueDate: "Jan 12, 2021", expiryDate: "Jan 11, 2025", lastCheck: "Oct 05, 2025", nextCheck: "Jan 05, 2026", status: "expired" as const, checkResult: "License Expired" },
  { id: 5, driver: "Lucas Brown", licenseNumber: "DL-2023-89012", licenseClass: "B, BE", issueDate: "Feb 28, 2023", expiryDate: "Feb 27, 2033", lastCheck: "Jan 08, 2026", nextCheck: "Apr 08, 2026", status: "valid" as const, checkResult: "Passed" },
  { id: 6, driver: "Sophie Anderson", licenseNumber: "DL-2020-34567", licenseClass: "B", issueDate: "Sep 14, 2020", expiryDate: "Sep 13, 2030", lastCheck: "Dec 22, 2025", nextCheck: "Mar 22, 2026", status: "valid" as const, checkResult: "Passed" },
  { id: 7, driver: "Michael Chen", licenseNumber: "DL-2018-56789", licenseClass: "B, C", issueDate: "Apr 10, 2018", expiryDate: "Apr 09, 2028", lastCheck: "Nov 15, 2025", nextCheck: "Feb 15, 2026", status: "due" as const, checkResult: "Pending" },
  { id: 8, driver: "Anna Kowalski", licenseNumber: "DL-2022-12345", licenseClass: "B", issueDate: "Jul 22, 2022", expiryDate: "Jul 21, 2032", lastCheck: "Jan 10, 2026", nextCheck: "Apr 10, 2026", status: "valid" as const, checkResult: "Passed" },
  { id: 9, driver: "Thomas Weber", licenseNumber: "DL-2019-67890", licenseClass: "B, BE, C1E", issueDate: "Nov 30, 2019", expiryDate: "Nov 29, 2029", lastCheck: "Oct 28, 2025", nextCheck: "Jan 28, 2026", status: "due" as const, checkResult: "Pending" },
  { id: 10, driver: "Jennifer Lee", licenseNumber: "DL-2021-23456", licenseClass: "B", issueDate: "Mar 05, 2021", expiryDate: "Mar 04, 2031", lastCheck: "Dec 18, 2025", nextCheck: "Mar 18, 2026", status: "valid" as const, checkResult: "Passed" },
  { id: 11, driver: "David Müller", licenseNumber: "DL-2020-78901", licenseClass: "B, C", issueDate: "Oct 12, 2020", expiryDate: "Oct 11, 2030", lastCheck: "Jan 05, 2026", nextCheck: "Apr 05, 2026", status: "valid" as const, checkResult: "Passed" },
  { id: 12, driver: "Sarah Johnson", licenseNumber: "DL-2017-45678", licenseClass: "B", issueDate: "May 18, 2017", expiryDate: "May 17, 2027", lastCheck: "Sep 25, 2025", nextCheck: "Dec 25, 2025", status: "expired" as const, checkResult: "Check Overdue" },
  { id: 13, driver: "Robert Schmidt", licenseNumber: "DL-2023-90123", licenseClass: "B, BE", issueDate: "Aug 08, 2023", expiryDate: "Aug 07, 2033", lastCheck: "Jan 12, 2026", nextCheck: "Apr 12, 2026", status: "valid" as const, checkResult: "Passed" },
  { id: 14, driver: "Lisa Martinez", licenseNumber: "DL-2021-56789", licenseClass: "B", issueDate: "Dec 20, 2021", expiryDate: "Dec 19, 2031", lastCheck: "Nov 30, 2025", nextCheck: "Feb 28, 2026", status: "due" as const, checkResult: "Pending" },
  { id: 15, driver: "Peter Novak", licenseNumber: "DL-2019-12346", licenseClass: "B, C1", issueDate: "Jun 15, 2019", expiryDate: "Jun 14, 2029", lastCheck: "Dec 08, 2025", nextCheck: "Mar 08, 2026", status: "valid" as const, checkResult: "Passed" },
  { id: 16, driver: "Emily Davis", licenseNumber: "DL-2022-67891", licenseClass: "B", issueDate: "Sep 28, 2022", expiryDate: "Sep 27, 2032", lastCheck: "Jan 02, 2026", nextCheck: "Apr 02, 2026", status: "valid" as const, checkResult: "Passed" },
  { id: 17, driver: "James Wilson", licenseNumber: "DL-2018-23457", licenseClass: "B, BE, C", issueDate: "Feb 14, 2018", expiryDate: "Feb 13, 2028", lastCheck: "Oct 20, 2025", nextCheck: "Jan 20, 2026", status: "expired" as const, checkResult: "Check Overdue" },
  { id: 18, driver: "Nina Bergmann", licenseNumber: "DL-2020-89012", licenseClass: "B", issueDate: "Nov 05, 2020", expiryDate: "Nov 04, 2030", lastCheck: "Dec 28, 2025", nextCheck: "Mar 28, 2026", status: "valid" as const, checkResult: "Passed" },
  { id: 19, driver: "Alexander Popov", licenseNumber: "DL-2021-34568", licenseClass: "B, C1", issueDate: "Apr 25, 2021", expiryDate: "Apr 24, 2031", lastCheck: "Jan 14, 2026", nextCheck: "Apr 14, 2026", status: "valid" as const, checkResult: "Passed" },
  { id: 20, driver: "Caroline Foster", licenseNumber: "DL-2019-78902", licenseClass: "B", issueDate: "Jul 30, 2019", expiryDate: "Jul 29, 2029", lastCheck: "Nov 10, 2025", nextCheck: "Feb 10, 2026", status: "due" as const, checkResult: "Pending" },
  { id: 21, driver: "Marcus Taylor", licenseNumber: "DL-2023-45679", licenseClass: "B, BE", issueDate: "Oct 18, 2023", expiryDate: "Oct 17, 2033", lastCheck: "Jan 18, 2026", nextCheck: "Apr 18, 2026", status: "valid" as const, checkResult: "Passed" },
  { id: 22, driver: "Olivia Hart", licenseNumber: "DL-2022-90124", licenseClass: "B", issueDate: "May 12, 2022", expiryDate: "May 11, 2032", lastCheck: "Dec 15, 2025", nextCheck: "Mar 15, 2026", status: "valid" as const, checkResult: "Passed" },
];

const StatusBadge = ({ status }: { status: "valid" | "due" | "expired" }) => {
  const styles = {
    valid: "bg-success/10 text-success border-success/20",
    due: "bg-warning/10 text-warning border-warning/20",
    expired: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const labels = {
    valid: "Valid",
    due: "Check Due",
    expired: "Expired",
  };

  const icons = {
    valid: CheckCircle2,
    due: Clock,
    expired: AlertTriangle,
  };

  const Icon = icons[status];

  return (
    <Badge variant="outline" className={`${styles[status]} gap-1`}>
      <Icon className="h-3 w-3" />
      {labels[status]}
    </Badge>
  );
};

export function DriverLicenseCheck() {
  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Bulk Upload
        </Button>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Check
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <IdCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">22</p>
              <p className="text-xs text-muted-foreground">Total Drivers</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-success">14</p>
              <p className="text-xs text-muted-foreground">Valid Licenses</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-warning">5</p>
              <p className="text-xs text-muted-foreground">Checks Due</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-destructive">3</p>
              <p className="text-xs text-muted-foreground">Expired/Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* License Verification Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Driver</TableHead>
              <TableHead>License Number</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Last Check</TableHead>
              <TableHead>Next Check</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {licenseChecks.map((check) => (
              <TableRow key={check.id}>
                <TableCell className="font-medium">{check.driver}</TableCell>
                <TableCell className="font-mono text-sm">{check.licenseNumber}</TableCell>
                <TableCell>{check.licenseClass}</TableCell>
                <TableCell>{check.expiryDate}</TableCell>
                <TableCell>{check.lastCheck}</TableCell>
                <TableCell>{check.nextCheck}</TableCell>
                <TableCell>
                  <StatusBadge status={check.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-success hover:text-success hover:bg-success/10"
                      title="Mark as Verified"
                    >
                      <ShieldCheck className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Upcoming Checks */}
      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-foreground">Upcoming License Checks</h4>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-warning/5 rounded-lg border border-warning/20">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-warning" />
              <div>
                <p className="text-sm font-medium text-foreground">John Mitchell</p>
                <p className="text-xs text-muted-foreground">Check due: Feb 20, 2026</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Schedule Now
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Maria Santos</p>
                <p className="text-xs text-muted-foreground">Next check: Mar 10, 2026</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}



