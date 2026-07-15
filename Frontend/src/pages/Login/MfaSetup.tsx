import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import AuthShell from "./components/AuthShell";
import { getMfaSecret, getAccountEmail, formatSecret, buildOtpAuthUri } from "./mfa";

const MfaSetup: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const secret = useMemo(() => getMfaSecret(), []);
  const account = useMemo(() => getAccountEmail(), []);
  const otpAuthUri = useMemo(() => buildOtpAuthUri(secret, account), [secret, account]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      toast.success(t.mfa.copied);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t.common.error);
    }
  };

  const steps = [t.mfa.step1, t.mfa.step2, t.mfa.step3];

  return (
    <AuthShell>
      {/* Logo */}
      <div className="mb-6">
        <img
          src="/TESSERON.png"
          alt="TESSERON Logo"
          className="h-9 sm:h-10 w-auto object-contain transition-all duration-300 -ml-[0.6rem]"
        />
      </div>

      {/* Heading */}
      <div className="mb-5">
        <h1 className="text-base sm:text-lg font-bold text-slate-900 mb-1 tracking-tight">
          {t.mfa.setupTitle}
        </h1>
        <p className="text-slate-500 text-xs leading-relaxed">
          {t.mfa.setupSubtitle}
        </p>
      </div>

      {/* QR code */}
      <div className="flex justify-center mb-5">
        <div className="relative p-3 bg-white rounded-2xl border border-slate-200 shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
          {/* Decorative corner frame */}
          <span className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-primary/40 rounded-tl-md" />
          <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-primary/40 rounded-tr-md" />
          <span className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-primary/40 rounded-bl-md" />
          <span className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-primary/40 rounded-br-md" />
          <QRCodeSVG
            value={otpAuthUri}
            size={124}
            level="M"
            marginSize={2}
            fgColor="#0f172a"
            bgColor="#ffffff"
          />
        </div>
      </div>

      {/* Manual setup key */}
      <div className="mb-5">
        <p className="text-[10px] font-bold text-slate-400 tracking-[0.08em] uppercase mb-1.5">
          {t.mfa.cantScan}
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 h-10 flex items-center bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 tracking-[0.1em] font-mono truncate">
            {formatSecret(secret)}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            title={t.mfa.copyKey}
            className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/40 transition-all duration-200 active:scale-95"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Steps */}
      <ol className="space-y-2 mb-6">
        {steps.map((step, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <span className="shrink-0 mt-px w-[18px] h-[18px] rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
              {idx + 1}
            </span>
            <span className="text-xs text-slate-600 leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>

      {/* Continue */}
      <Button
        onClick={() => navigate("/mfa-verify")}
        className="w-full h-11 rounded-xl bg-primary hover:bg-slate-900 text-white font-semibold text-sm shadow-lg shadow-primary/20 transition-all duration-300 active:scale-[0.98] group/btn"
      >
        {t.mfa.continue}
        <ArrowRight className="h-4 w-4 ml-1.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
      </Button>

      {/* Footer */}
      <div className="flex items-center justify-between mt-5">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t.mfa.back}
        </Link>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          {t.mfa.secured}
        </span>
      </div>
    </AuthShell>
  );
};

export default MfaSetup;


