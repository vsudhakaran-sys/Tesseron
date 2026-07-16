import { useState } from "react";
import { Clock, MapPin, Car } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/common/ui/sheet";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { DatePicker } from "@/components/common/ui/date-picker";
import { Label } from "@/components/common/ui/label";
import { Textarea } from "@/components/common/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common/ui/select";
import { toast } from "@/hooks/use-toast";

interface VehicleRequestSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const vehicleTypes = [
  { value: "compact", label: "Compact (VW Golf, Audi A3)" },
  { value: "sedan", label: "Sedan (BMW 3er, Audi A4)" },
  { value: "suv", label: "SUV (BMW X3, Audi Q5)" },
  { value: "van", label: "Van (VW Transporter)" },
];

export function VehicleRequestSheet({ open, onOpenChange }: VehicleRequestSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vehicleType: "",
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "17:00",
    destination: "",
    purpose: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Request submitted",
      description: "Your vehicle request has been sent for approval.",
    });
    
    setIsSubmitting(false);
    setFormData({
      vehicleType: "",
      startDate: "",
      endDate: "",
      startTime: "09:00",
      endTime: "17:00",
      destination: "",
      purpose: "",
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90dvh] rounded-t-2xl">
        <SheetHeader className="text-left pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Request Vehicle</SheetTitle>
              <SheetDescription>Book a pool vehicle for your trip</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto pb-8">
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Select 
              value={formData.vehicleType} 
              onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <DatePicker
                id="startDate"
                value={formData.startDate}
                onChange={(v) => setFormData({ ...formData, startDate: v })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <DatePicker
                id="endDate"
                value={formData.endDate}
                onChange={(v) => setFormData({ ...formData, endDate: v })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Pickup Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Return Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="destination"
                placeholder="e.g., Munich Office, Customer Site"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Trip</Label>
            <Textarea
              id="purpose"
              placeholder="Brief description of your trip purpose..."
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              rows={3}
              required
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}



