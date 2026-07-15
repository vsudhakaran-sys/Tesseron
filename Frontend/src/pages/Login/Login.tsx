import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import LoginBackground from "./components/LoginBackground";
import LoginStats from "./components/LoginStats";
import LoginForm from "./components/LoginForm";

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Normalize viewport height for mobile browsers
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("TESSERON_token", data.token);
        localStorage.setItem("TESSERON_user", JSON.stringify(data.user));
        // Navigate directly to the dashboard
        navigate("/");
      } else {
        alert(data.message || t.login.invalidCredentials);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(t.login.connectionFailed);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 relative overflow-x-hidden overflow-y-auto font-sans" 
         style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
      
      <LoginBackground />

      <div className="w-full max-w-[450px] sm:max-w-[500px] lg:max-w-[1100px] h-auto lg:min-h-[600px] flex flex-col lg:flex-row bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] group relative z-10">
        
        <LoginStats />
        
        <LoginForm 
          email={email} 
          setEmail={setEmail} 
          password={password}
          setPassword={setPassword}
          onSubmit={handleLogin} 
        />
        
      </div>
    </div>
  );
}


