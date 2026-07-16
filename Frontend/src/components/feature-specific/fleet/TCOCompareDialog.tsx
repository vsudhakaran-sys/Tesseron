import { cn } from "@/utils/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/ui/table";
import { Badge } from "@/components/common/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CompareVehicle {
  plate: string;
  model: string;
  driver: string;
  leasingCost: number;
  fuelCost: number;
  insuranceCost: number;
  maintenanceCost: number;
  taxCost: number;
  totalCost: number;
  costPerKm: number;
  mileage: number;
}

interface TCOCompareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicles: CompareVehicle[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);

const costCategories = [
  { key: "leasingCost", label: "Leasing" },
  { key: "fuelCost", label: "Fuel" },
  { key: "insuranceCost", label: "Insurance" },
  { key: "maintenanceCost", label: "Maintenance" },
  { key: "taxCost", label: "Tax" },
] as const;

const COLORS = [
  "hsl(var(--primary))",
  "hsl(210, 70%, 55%)",
  "hsl(160, 60%, 45%)",
  "hsl(30, 80%, 55%)",
  "hsl(280, 60%, 55%)",
];

export function TCOCompareDialog({ open, onOpenChange, vehicles }: TCOCompareDialogProps) {
  const chartData = costCategories.map((cat) => {
    const entry: Record<string, string | number> = { category: cat.label };
    vehicles.forEach((v) => {
      entry[v.plate] = v[cat.key];
    });
    return entry;
  });

  const lowestTotal = Math.min(...vehicles.map((v) => v.totalCost));
  const lowestCostPerKm = Math.min(...vehicles.map((v) => v.costPerKm));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vehicle TCO Comparison</DialogTitle>
        </DialogHeader>

        {/* Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              {vehicles.map((v, i) => (
                <Bar key={v.plate} dataKey={v.plate} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table comparison */}
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Category</TableHead>
                {vehicles.map((v) => (
                  <TableHead key={v.plate} className="text-right">
                    <div>
                      <div className="font-semibold">{v.plate}</div>
                      <div className="text-xs font-normal text-muted-foreground">{v.model}</div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {costCategories.map((cat) => {
                const values = vehicles.map((v) => v[cat.key]);
                const min = Math.min(...values);
                return (
                  <TableRow key={cat.key}>
                    <TableCell className="font-medium">{cat.label}</TableCell>
                    {vehicles.map((v) => (
                      <TableCell key={v.plate} className="text-right">
                        <span className={cn(v[cat.key] === min && vehicles.length > 1 && "text-emerald-600 font-semibold")}>
                          {v[cat.key] === 0 ? "—" : formatCurrency(v[cat.key])}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              <TableRow className="border-t-2">
                <TableCell className="font-bold">Total</TableCell>
                {vehicles.map((v) => (
                  <TableCell key={v.plate} className="text-right">
                    <span className={cn("font-bold", v.totalCost === lowestTotal && vehicles.length > 1 && "text-emerald-600")}>
                      {formatCurrency(v.totalCost)}
                    </span>
                    {v.totalCost === lowestTotal && vehicles.length > 1 && (
                      <Badge variant="secondary" className="ml-2 text-xs bg-emerald-100 text-emerald-700">
                        Lowest
                      </Badge>
                    )}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Cost per km</TableCell>
                {vehicles.map((v) => (
                  <TableCell key={v.plate} className="text-right">
                    <span className={cn(v.costPerKm === lowestCostPerKm && vehicles.length > 1 && "text-emerald-600 font-semibold")}>
                      {v.costPerKm === 0 ? "—" : `€${v.costPerKm.toFixed(2)}`}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Mileage</TableCell>
                {vehicles.map((v) => (
                  <TableCell key={v.plate} className="text-right text-muted-foreground">
                    {new Intl.NumberFormat("de-DE").format(v.mileage)} km
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Driver</TableCell>
                {vehicles.map((v) => (
                  <TableCell key={v.plate} className="text-right text-muted-foreground">
                    {v.driver}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}



