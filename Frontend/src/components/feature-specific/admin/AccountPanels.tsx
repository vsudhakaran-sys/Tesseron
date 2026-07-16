import { useState } from "react";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Switch } from "@/components/common/ui/switch";
import { PanelHeader } from "./shared";
import type { AdminCopy } from "./translations";

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
      {help && <p className="text-[11px] text-slate-400 mt-1">{help}</p>}
    </div>
  );
}

function NativeSelect({ children, defaultValue }: { children: React.ReactNode; defaultValue?: string }) {
  return (
    <select
      defaultValue={defaultValue}
      className="w-full h-9 rounded-lg border border-border bg-white px-3 text-sm text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
    >
      {children}
    </select>
  );
}

function SwitchRow({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <div className="text-sm font-semibold text-slate-800">{title}</div>
        <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
      </div>
      {children}
    </div>
  );
}

export function GeneralPanel({ t }: { t: AdminCopy }) {
  return (
    <div className="animate-fade-in">
      <PanelHeader title={t.generalTitle} description={t.generalDesc} actions={<Button size="sm">{t.save}</Button>} />

      <div className="space-y-5">
        <Card title={t.orgSection}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <Field label={t.orgDisplayName}><Input defaultValue="Müller Holding GmbH" className="h-9" /></Field>
            <Field label={t.primaryContact}><Input defaultValue="anna.mueller@mueller.de" className="h-9 font-mono" /></Field>
          </div>
        </Card>

        <Card title={t.localization}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            <Field label={t.baseCurrency}>
              <NativeSelect defaultValue="EUR"><option>EUR</option><option>USD</option><option>CHF</option><option>GBP</option></NativeSelect>
            </Field>
            <Field label={t.timezone}>
              <NativeSelect defaultValue="Europe/Berlin"><option>Europe/Berlin (UTC+1)</option><option>Europe/London (UTC+0)</option><option>Europe/Paris (UTC+1)</option></NativeSelect>
            </Field>
            <Field label={t.dateFormat}>
              <NativeSelect defaultValue="DD.MM.YYYY"><option>DD.MM.YYYY</option><option>YYYY-MM-DD</option><option>MM/DD/YYYY</option></NativeSelect>
            </Field>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Profile, Security & MFA, and Preferences merged into a single Account screen.
export function AccountPanel({ t }: { t: AdminCopy }) {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [weekly, setWeekly] = useState(true);
  return (
    <div className="animate-fade-in">
      <PanelHeader title={t.accountTitle} description={t.accountDesc} actions={<Button size="sm">{t.save}</Button>} />

      <div className="space-y-5">
        {/* Profile spans the full width — its fields read best in a 2-up grid */}
        <Card title={t.profileTitle}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <Field label={t.fullName}><Input defaultValue="Anna Müller" className="h-9" /></Field>
            <Field label={t.email}><Input defaultValue="anna.mueller@mueller.de" disabled className="h-9 bg-slate-50 font-mono" /></Field>
            <Field label={t.defaultLanguage}>
              <NativeSelect defaultValue="de-DE"><option>de-DE (German)</option><option>en-GB (English)</option><option>fr-FR (French)</option></NativeSelect>
            </Field>
            <Field label={t.timezone}>
              <NativeSelect defaultValue="Europe/Berlin"><option>Europe/Berlin (UTC+1)</option><option>Europe/London (UTC+0)</option></NativeSelect>
            </Field>
          </div>
        </Card>

        {/* Security and Preferences sit side by side to keep everything in one view */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-stretch">
          <Card title={t.securityTitle} hint={t.securityHandled}>
            <SwitchRow title={t.password} desc={t.passwordChanged}>
              <Button variant="outline" size="sm" className="text-xs">{t.changePassword} →</Button>
            </SwitchRow>
            <SwitchRow title={t.mfaLabel} desc={t.mfaEnrolled}>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {t.statusActive}
              </span>
            </SwitchRow>
            <SwitchRow title={t.passkey} desc={t.passkeyDesc}>
              <Button variant="outline" size="sm" className="text-xs">{t.addPasskey} →</Button>
            </SwitchRow>
            <SwitchRow title={t.recoveryCodes} desc={t.recoveryDesc}>
              <Button variant="outline" size="sm" className="text-xs">{t.viewCodes} →</Button>
            </SwitchRow>
          </Card>

          <Card title={t.preferencesTitle}>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <div className="text-sm font-semibold text-slate-800">{t.landingPage}</div>
                <div className="text-xs text-slate-500 mt-0.5">{t.landingDesc}</div>
              </div>
              <div className="w-48">
                <NativeSelect defaultValue="Dashboard"><option>Dashboard</option><option>Users</option><option>Organizations</option></NativeSelect>
              </div>
            </div>
            <SwitchRow title={t.emailNotifs} desc={t.emailNotifsDesc}>
              <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
            </SwitchRow>
            <SwitchRow title={t.weeklyDigest} desc={t.weeklyDigestDesc}>
              <Switch checked={weekly} onCheckedChange={setWeekly} />
            </SwitchRow>
          </Card>
        </div>
      </div>
    </div>
  );
}
