import { PageHeader } from "@/components/feature-specific/fleet/PageHeader";
import { useLanguage } from "@/hooks/useLanguage";
import { SettingsLayout, getAdminCopy } from "@/components/feature-specific/admin";

export default function Settings() {
  const { locale } = useLanguage();
  const t = getAdminCopy(locale);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title={t.title} description={t.desc} />
      <SettingsLayout t={t} />
    </div>
  );
}
