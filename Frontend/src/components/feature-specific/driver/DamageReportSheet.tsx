import { useState } from "react";
import { AlertTriangle, Camera, MapPin, Upload, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/common/ui/sheet";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { Textarea } from "@/components/common/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common/ui/select";
import { DatePicker } from "@/components/common/ui/date-picker";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/utils/utils";

interface DamageReportSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const damageTypes = [
  { value: "scratch", label: "Scratch" },
  { value: "dent", label: "Dent" },
  { value: "broken_glass", label: "Broken Glass/Window" },
  { value: "tire", label: "Tire Damage" },
  { value: "mechanical", label: "Mechanical Issue" },
  { value: "interior", label: "Interior Damage" },
  { value: "other", label: "Other" },
];

const severityLevels = [
  { value: "minor", label: "Minor - Cosmetic only", color: "bg-amber-500" },
  { value: "moderate", label: "Moderate - Affects usability", color: "bg-orange-500" },
  { value: "severe", label: "Severe - Vehicle undrivable", color: "bg-destructive" },
];

export function DamageReportSheet({ open, onOpenChange }: DamageReportSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    damageType: "",
    severity: "",
    location: "",
    description: "",
    incidentDate: "",
    incidentLocation: "",
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Damage report submitted",
      description: "Fleet management has been notified and will review your report.",
    });
    
    setIsSubmitting(false);
    setFormData({
      damageType: "",
      severity: "",
      location: "",
      description: "",
      incidentDate: "",
      incidentLocation: "",
    });
    setPhotos([]);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90dvh] rounded-t-2xl">
        <SheetHeader className="text-left pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <SheetTitle>Report Damage</SheetTitle>
              <SheetDescription>Document vehicle damage for review</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto pb-8">
          {/* Photo Upload Section */}
          <div className="space-y-2">
            <Label>Photos of Damage</Label>
            <div className="flex flex-wrap gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative h-20 w-20 rounded-lg overflow-hidden border">
                  <img src={photo} alt={`Damage ${index + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary hover:bg-accent transition-colors">
                <Camera className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">Upload photos of the damage from multiple angles</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="damageType">Damage Type</Label>
              <Select 
                value={formData.damageType} 
                onValueChange={(value) => setFormData({ ...formData, damageType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {damageTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="incidentDate">Incident Date</Label>
              <DatePicker
                id="incidentDate"
                value={formData.incidentDate}
                onChange={(v) => setFormData({ ...formData, incidentDate: v })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Severity Level</Label>
            <div className="grid grid-cols-1 gap-2">
              {severityLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, severity: level.value })}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                    formData.severity === level.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent"
                  )}
                >
                  <div className={cn("h-3 w-3 rounded-full", level.color)} />
                  <span className="text-sm">{level.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location on Vehicle</Label>
            <Input
              id="location"
              placeholder="e.g., Front bumper, driver side door"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="incidentLocation">Where did it happen?</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="incidentLocation"
                placeholder="Address or location description"
                value={formData.incidentLocation}
                onChange={(e) => setFormData({ ...formData, incidentLocation: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what happened and the extent of the damage..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Damage Report"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}



