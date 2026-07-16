import { useState } from "react";
import { Plus, Trash2, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/common/ui/select";
import { SectionHeader } from "../SectionHeader";
import { SubtleSelectItem } from "../SubtleSelectItem";
import type { InvitedUser } from "../types";
import type { CustomerCopy, Locale } from "../translations";

interface UsersAccessStepProps {
  t: CustomerCopy;
  locale: Locale;
  invitedUsers: InvitedUser[];
  onAddUser: (user: InvitedUser) => void;
  onRemoveUser: (index: number) => void;
}

// Step 2: Users & Access — owns the transient "add user" form fields
export function UsersAccessStep({ t, locale, invitedUsers, onAddUser, onRemoveUser }: UsersAccessStepProps) {
  const [tempUserName, setTempUserName] = useState("");
  const [tempUserEmail, setTempUserEmail] = useState("");
  const [tempUserRole, setTempUserRole] = useState("Admin");

  const handleAddUser = () => {
    if (!tempUserName.trim()) {
      toast.error(t.invalidName);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!tempUserEmail.trim() || !emailRegex.test(tempUserEmail)) {
      toast.error(t.invalidEmail);
      return;
    }

    onAddUser({ name: tempUserName, email: tempUserEmail, role: tempUserRole, status: "Pending" });
    setTempUserName("");
    setTempUserEmail("");
    setTempUserRole("Admin");
    toast.success(t.userAdded);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Section: Add New User ── */}
      <div className="space-y-4">
        <SectionHeader icon={UserPlus} label={locale === "nl" ? "Gebruiker toevoegen" : "Add New User"} />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground opacity-85" htmlFor="user-name">
              {t.fullName}
            </label>
            <Input
              id="user-name"
              placeholder="e.g. Sarah Jenkins"
              value={tempUserName}
              onChange={(e) => setTempUserName(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground opacity-85" htmlFor="user-email">
              {t.emailAddress}
            </label>
            <Input
              id="user-email"
              placeholder="sarah@company.com"
              value={tempUserEmail}
              onChange={(e) => setTempUserEmail(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground opacity-85" htmlFor="user-role">
              {t.role}
            </label>
            <Select value={tempUserRole} onValueChange={setTempUserRole}>
              <SelectTrigger id="user-role" className="h-9 text-xs bg-white dark:bg-slate-900 rounded-lg">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent className="z-[110] rounded-xl border border-border shadow-lg">
                <SubtleSelectItem value="Admin">Admin</SubtleSelectItem>
                <SubtleSelectItem value="Manager">Manager</SubtleSelectItem>
                <SubtleSelectItem value="Viewer">Viewer</SubtleSelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleAddUser}
            className="h-9 text-xs border-dashed justify-center border-2 border-border text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1 w-full"
          >
            <Plus className="h-3.5 w-3.5" />
            {t.inviteUser}
          </Button>
        </div>
      </div>

      {/* ── Section: Team Members ── */}
      <div className="space-y-3">
        <SectionHeader icon={Users} label={locale === "nl" ? "Teamleden" : "Team Members"} />
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {invitedUsers.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-4 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg">
              {t.noUsers}
            </div>
          ) : (
            invitedUsers.map((user, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 dark:bg-blue-900/30 text-primary border border-blue-100 dark:border-blue-900/45">
                    {user.role}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveUser(idx)}
                    className="h-6 w-6 text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
