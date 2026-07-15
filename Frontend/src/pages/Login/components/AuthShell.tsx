import React, { useEffect } from "react";
import LoginBackground from "./LoginBackground";
import LoginStats from "./LoginStats";

interface AuthShellProps {
  children: React.ReactNode;
}

/**
 * Shared chrome for the authentication flow (login, MFA setup, MFA verify).
 * Renders the animated background, the left marketing/stats panel, and a
 * white right-hand panel that hosts the screen-specific form content.
 */
const AuthShell: React.FC<AuthShellProps> = ({ children }) => {
  useEffect(() => {
    // Normalize viewport height for mobile browsers
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 relative overflow-x-hidden overflow-y-auto font-sans"
      style={{ minHeight: "calc(var(--vh, 1vh) * 100)" }}
    >
      <LoginBackground />

      <div className="w-full max-w-[450px] sm:max-w-[500px] lg:max-w-[1100px] h-auto lg:min-h-[600px] flex flex-col lg:flex-row bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] group relative z-10">
        <LoginStats />

        <div className="w-full lg:w-[52%] flex flex-col p-6 sm:p-10 md:p-12 lg:p-16 justify-center relative bg-white overflow-hidden">
          <div className="max-w-[400px] mx-auto w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
