import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { OTPInput, OTPInputContext, REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowRight, ArrowLeft, ShieldCheck, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/utils/utils";
import { getAccountEmail } from "./mfa";
import AuthShell from "./components/AuthShell";

const RESEND_SECONDS = 30;

// A single, separated OTP cell with focus / filled states.
function OtpDigit({ index }: { index: number }) {
  const { slots } = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = slots[index];

  return (
    <div
      className={cn(
        "relative flex h-[60px] w-12 sm:w-[52px] items-center justify-center rounded-xl border bg-slate-50 text-2xl font-bold text-slate-900 transition-all duration-200",
        isActive
          ? "border-primary bg-white ring-4 ring-primary/10 shadow-sm"
          : char
          ? "border-slate-300 bg-white"
          : "border-slate-200"
      )}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-px bg-primary animate-caret-blink duration-1000" />
        </div>
      )}
    </div>
  );
}

const MfaVerify: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const account = getAccountEmail();

  // Resend countdown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const completeVerification = () => {
    // Demo flow: any complete 6-digit code is accepted.
    toast.success(t.mfa.verified);
    navigate("/");
  };

  // Auto-submit once all six digits are entered.
  useEffect(() => {
    if (code.length === 6) completeVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handleVerify = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.length < 6) {
      toast.error(t.mfa.invalidCode);
      return;
    }
    completeVerification();
  };

  const handleResend = () => {
    setCode("");
    setSecondsLeft(RESEND_SECONDS);
    toast.success(t.mfa.resent);
  };

  return (
    <AuthShell>
      <div className="flex flex-col items-center text-center">
        {/* Logo */}
        <img
          src="/TESSERON.png"
          alt="TESSERON Logo"
          className="h-10 sm:h-11 w-auto object-contain mb-10"
        />

        {/* Icon badge */}
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 ring-8 ring-primary/5">
          <KeyRound className="h-6 w-6 text-primary" strokeWidth={2.25} />
        </div>

        {/* Heading */}
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {t.mfa.verifyTitle}
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mt-2.5 max-w-[320px]">
          {t.mfa.verifySubtitle}
        </p>
        <span className="inline-flex items-center mt-4 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
          {account}
        </span>
      </div>

      {/* OTP form */}
      <form onSubmit={handleVerify} className="mt-10 space-y-8">
        <OTPInput
          maxLength={6}
          value={code}
          onChange={setCode}
          pattern={REGEXP_ONLY_DIGITS}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          containerClassName="flex items-center justify-center gap-2.5 sm:gap-3"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <OtpDigit key={i} index={i} />
          ))}
        </OTPInput>

        <Button
          type="submit"
          disabled={code.length < 6}
          className="w-full h-[52px] rounded-xl bg-primary hover:bg-slate-900 text-white font-semibold text-sm shadow-lg shadow-primary/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 group/btn"
        >
          {t.mfa.verify}
          <ArrowRight className="h-4 w-4 ml-1.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </Button>

        {/* Resend */}
        <div className="flex items-center justify-center gap-1.5 text-sm">
          <span className="text-slate-500">{t.mfa.resend}</span>
          {secondsLeft > 0 ? (
            <span className="font-bold text-slate-400 tabular-nums">
              {t.mfa.resendAction} ({secondsLeft}s)
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-bold text-primary hover:text-slate-900 hover:underline transition-all"
            >
              {t.mfa.resendAction}
            </button>
          )}
        </div>
      </form>

      {/* Footer */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-100">
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

export default MfaVerify;


