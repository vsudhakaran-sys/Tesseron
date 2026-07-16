import { useState } from "react";
import { Receipt, Upload, X, FileText, Euro } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/common/ui/sheet";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { Textarea } from "@/components/common/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common/ui/select";
import { DatePicker } from "@/components/common/ui/date-picker";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/utils/utils";

interface BillUploadSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const expenseTypes = [
  { value: "fuel", label: "Fuel", icon: "⛽" },
  { value: "parking", label: "Parking", icon: "🅿️" },
  { value: "toll", label: "Toll Fees", icon: "🛣️" },
  { value: "wash", label: "Car Wash", icon: "🚿" },
  { value: "repair", label: "Minor Repair", icon: "🔧" },
  { value: "other", label: "Other", icon: "📋" },
];

export function BillUploadSheet({ open, onOpenChange }: BillUploadSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [receiptName, setReceiptName] = useState("");
  const [formData, setFormData] = useState({
    expenseType: "",
    amount: "",
    vendor: "",
    date: "",
    description: "",
  });

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceipt(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReceipt = () => {
    setReceipt(null);
    setReceiptName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!receipt) {
      toast({
        title: "Receipt required",
        description: "Please upload a photo or PDF of your receipt.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Bill submitted",
      description: `Your ${formData.expenseType} expense of €${formData.amount} has been submitted for review.`,
    });
    
    setIsSubmitting(false);
    setFormData({
      expenseType: "",
      amount: "",
      vendor: "",
      date: "",
      description: "",
    });
    setReceipt(null);
    setReceiptName("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90dvh] rounded-t-2xl">
        <SheetHeader className="text-left pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <SheetTitle>Upload Bill</SheetTitle>
              <SheetDescription>Submit fuel or expense receipts</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto pb-8">
          {/* Receipt Upload */}
          <div className="space-y-2">
            <Label>Receipt / Invoice</Label>
            {receipt ? (
              <div className="relative border rounded-xl p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  {receipt.startsWith("data:image") ? (
                    <img src={receipt} alt="Receipt" className="h-16 w-16 object-cover rounded-lg" />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{receiptName}</p>
                    <p className="text-xs text-muted-foreground">Tap to preview</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeReceipt}
                    className="h-8 w-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/30 rounded-xl cursor-pointer hover:border-primary hover:bg-accent transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Tap to upload receipt</span>
                <span className="text-xs text-muted-foreground mt-1">Photo or PDF</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleReceiptUpload}
                />
              </label>
            )}
          </div>

          {/* Expense Type Selection */}
          <div className="space-y-2">
            <Label>Expense Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {expenseTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, expenseType: type.value })}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-xl border transition-colors",
                    formData.expenseType === type.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent"
                  )}
                >
                  <span className="text-xl">{type.icon}</span>
                  <span className="text-xs font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <DatePicker
                id="date"
                value={formData.date}
                onChange={(v) => setFormData({ ...formData, date: v })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor / Station</Label>
            <Input
              id="vendor"
              placeholder="e.g., Shell, Aral, APCOA"
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Notes (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Any additional information..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Expense"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}



