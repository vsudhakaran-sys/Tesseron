import { Button } from "@/components/common/ui/button";
import { Badge } from "@/components/common/ui/badge";
import { Progress } from "@/components/common/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/ui/table";
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Plus,
  Download,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

const trainingRecords = [
  { id: 1, driver: "GP Sky", trainingType: "Annual UVV Instruction", completedDate: "Jan 10, 2026", validUntil: "Jan 10, 2027", instructor: "Hans Weber", certificate: "UVV-2026-001", status: "valid" as const },
  { id: 2, driver: "Maria Santos", trainingType: "Annual UVV Instruction", completedDate: "Nov 15, 2025", validUntil: "Nov 15, 2026", instructor: "Hans Weber", certificate: "UVV-2025-042", status: "valid" as const },
  { id: 3, driver: "John Mitchell", trainingType: "Annual UVV Instruction", completedDate: "Feb 20, 2025", validUntil: "Feb 20, 2026", instructor: "Klaus Müller", certificate: "UVV-2025-008", status: "expiring" as const },
  { id: 4, driver: "Emma Wilson", trainingType: "Annual UVV Instruction", completedDate: "Dec 05, 2024", validUntil: "Dec 05, 2025", instructor: "Klaus Müller", certificate: "UVV-2024-089", status: "expired" as const },
  { id: 5, driver: "Lucas Brown", trainingType: "Initial UVV Training", completedDate: "Aug 12, 2025", validUntil: "Aug 12, 2026", instructor: "Hans Weber", certificate: "UVV-2025-028", status: "valid" as const },
  { id: 6, driver: "Sophie Anderson", trainingType: "Annual UVV Instruction", completedDate: "Dec 18, 2025", validUntil: "Dec 18, 2026", instructor: "Hans Weber", certificate: "UVV-2025-055", status: "valid" as const },
  { id: 7, driver: "Michael Chen", trainingType: "Annual UVV Instruction", completedDate: "Jan 25, 2025", validUntil: "Jan 25, 2026", instructor: "Klaus Müller", certificate: "UVV-2025-004", status: "expired" as const },
  { id: 8, driver: "Anna Kowalski", trainingType: "Initial UVV Training", completedDate: "Sep 08, 2025", validUntil: "Sep 08, 2026", instructor: "Hans Weber", certificate: "UVV-2025-034", status: "valid" as const },
  { id: 9, driver: "Thomas Weber", trainingType: "Annual UVV Instruction", completedDate: "Mar 12, 2025", validUntil: "Mar 12, 2026", instructor: "Klaus Müller", certificate: "UVV-2025-012", status: "expiring" as const },
  { id: 10, driver: "Jennifer Lee", trainingType: "Annual UVV Instruction", completedDate: "Oct 30, 2025", validUntil: "Oct 30, 2026", instructor: "Hans Weber", certificate: "UVV-2025-039", status: "valid" as const },
  { id: 11, driver: "David Müller", trainingType: "Annual UVV Instruction", completedDate: "Jan 05, 2026", validUntil: "Jan 05, 2027", instructor: "Klaus Müller", certificate: "UVV-2026-002", status: "valid" as const },
  { id: 12, driver: "Sarah Johnson", trainingType: "Annual UVV Instruction", completedDate: "Nov 22, 2024", validUntil: "Nov 22, 2025", instructor: "Hans Weber", certificate: "UVV-2024-078", status: "expired" as const },
  { id: 13, driver: "Robert Schmidt", trainingType: "Initial UVV Training", completedDate: "Jul 15, 2025", validUntil: "Jul 15, 2026", instructor: "Klaus Müller", certificate: "UVV-2025-024", status: "valid" as const },
  { id: 14, driver: "Lisa Martinez", trainingType: "Annual UVV Instruction", completedDate: "Feb 28, 2025", validUntil: "Feb 28, 2026", instructor: "Hans Weber", certificate: "UVV-2025-009", status: "expiring" as const },
  { id: 15, driver: "Peter Novak", trainingType: "Annual UVV Instruction", completedDate: "Dec 02, 2025", validUntil: "Dec 02, 2026", instructor: "Klaus Müller", certificate: "UVV-2025-048", status: "valid" as const },
  { id: 16, driver: "Emily Davis", trainingType: "Initial UVV Training", completedDate: "Oct 10, 2025", validUntil: "Oct 10, 2026", instructor: "Hans Weber", certificate: "UVV-2025-037", status: "valid" as const },
  { id: 17, driver: "James Wilson", trainingType: "Annual UVV Instruction", completedDate: "Oct 15, 2024", validUntil: "Oct 15, 2025", instructor: "Klaus Müller", certificate: "UVV-2024-065", status: "expired" as const },
  { id: 18, driver: "Nina Bergmann", trainingType: "Annual UVV Instruction", completedDate: "Nov 28, 2025", validUntil: "Nov 28, 2026", instructor: "Hans Weber", certificate: "UVV-2025-045", status: "valid" as const },
  { id: 19, driver: "Alexander Popov", trainingType: "Initial UVV Training", completedDate: "Jun 20, 2025", validUntil: "Jun 20, 2026", instructor: "Klaus Müller", certificate: "UVV-2025-021", status: "valid" as const },
  { id: 20, driver: "Caroline Foster", trainingType: "Annual UVV Instruction", completedDate: "Mar 05, 2025", validUntil: "Mar 05, 2026", instructor: "Hans Weber", certificate: "UVV-2025-010", status: "expiring" as const },
  { id: 21, driver: "Marcus Taylor", trainingType: "Initial UVV Training", completedDate: "Aug 25, 2025", validUntil: "Aug 25, 2026", instructor: "Klaus Müller", certificate: "UVV-2025-030", status: "valid" as const },
  { id: 22, driver: "Olivia Hart", trainingType: "Annual UVV Instruction", completedDate: "Dec 12, 2025", validUntil: "Dec 12, 2026", instructor: "Hans Weber", certificate: "UVV-2025-052", status: "valid" as const },
];

const trainingModules = [
  { name: "Vehicle Safety Basics", duration: "45 min", required: true },
  { name: "Pre-Trip Inspection", duration: "30 min", required: true },
  { name: "Accident Prevention", duration: "60 min", required: true },
  { name: "Emergency Procedures", duration: "45 min", required: true },
  { name: "Load Securing", duration: "30 min", required: false },
  { name: "Winter Driving", duration: "30 min", required: false },
];

const StatusBadge = ({ status }: { status: "valid" | "expiring" | "expired" }) => {
  const styles = {
    valid: "bg-success/10 text-success border-success/20",
    expiring: "bg-warning/10 text-warning border-warning/20",
    expired: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const labels = {
    valid: "Valid",
    expiring: "Expiring Soon",
    expired: "Expired",
  };

  const icons = {
    valid: CheckCircle2,
    expiring: Clock,
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

export function UVVTraining() {
  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Training
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">22</p>
              <p className="text-xs text-muted-foreground">Total Records</p>
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
              <p className="text-xs text-muted-foreground">Compliant</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-warning">4</p>
              <p className="text-xs text-muted-foreground">Expiring Soon</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-destructive">4</p>
              <p className="text-xs text-muted-foreground">Expired</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Progress */}
      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium text-foreground">Fleet Compliance Rate</h4>
            <p className="text-sm text-muted-foreground">18 of 22 drivers are compliant</p>
          </div>
          <span className="text-2xl font-semibold text-primary">82%</span>
        </div>
        <Progress value={82} className="h-2" />
      </div>

      {/* Training Records Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Driver</TableHead>
              <TableHead>Training Type</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Certificate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainingRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.driver}</TableCell>
                <TableCell>{record.trainingType}</TableCell>
                <TableCell>{record.completedDate}</TableCell>
                <TableCell>{record.validUntil}</TableCell>
                <TableCell>{record.instructor}</TableCell>
                <TableCell className="font-mono text-sm">{record.certificate}</TableCell>
                <TableCell>
                  <StatusBadge status={record.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" title="View Certificate">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Schedule Renewal">
                      <RefreshCw className="h-4 w-4" />
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

      {/* Training Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">Training Modules</h4>
          </div>
          <div className="space-y-3">
            {trainingModules.map((module, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      module.required ? "bg-primary" : "bg-muted-foreground"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{module.name}</p>
                    <p className="text-xs text-muted-foreground">{module.duration}</p>
                  </div>
                </div>
                {module.required && (
                  <Badge variant="secondary" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Training Sessions */}
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">Scheduled Sessions</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-foreground">Emma Wilson - Renewal</p>
                  <p className="text-xs text-muted-foreground">Training overdue since Dec 2025</p>
                </div>
              </div>
              <Button size="sm" variant="destructive">
                Schedule
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-warning/5 rounded-lg border border-warning/20">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-warning" />
                <div>
                  <p className="text-sm font-medium text-foreground">John Mitchell - Renewal</p>
                  <p className="text-xs text-muted-foreground">Expires: Feb 20, 2026</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Schedule
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Group Session</p>
                  <p className="text-xs text-muted-foreground">Mar 15, 2026 • 09:00 AM</p>
                </div>
              </div>
              <Badge variant="secondary">3 Enrolled</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



