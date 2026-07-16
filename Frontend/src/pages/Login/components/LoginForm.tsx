import React, { useState } from 'react';
import { User, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import { Label } from '@/components/common/ui/label';
import { Checkbox } from '@/components/common/ui/checkbox';
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'react-router-dom';

interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
  onSubmit 
}) => {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full lg:w-[52%] flex flex-col p-6 sm:p-10 md:p-12 lg:p-16 justify-center relative bg-white overflow-hidden">
      <div className="max-w-[400px] mx-auto w-full">
        <div className="mb-10 lg:mb-12">
          <div className="mb-8 lg:mb-10">
            <img 
              src="/TESSERON.png" 
              alt="TESSERON Logo" 
              className="h-12 sm:h-14 lg:h-18 w-auto object-contain transition-all duration-300 -ml-[0.775rem]"
            />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold text-slate-900 mb-1 tracking-tight">
            {t.login.welcome}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            {t.login.enterDetails}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 sm:space-y-7">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-400 tracking-[0.1em] uppercase">
              {t.login.yourEmail}
            </Label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within/input:text-primary transition-colors">
                <User className="h-[18px] w-[18px]" strokeWidth={2} />
              </div>
              <Input
                type="email"
                placeholder={t.login.enterEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-[54px] sm:h-[58px] bg-slate-50 border-transparent rounded-[16px] text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
             <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-400 tracking-[0.1em] uppercase">
                {t.login.yourPassword}
              </Label>
            </div>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within/input:text-primary transition-colors">
                <Shield className="h-[18px] w-[18px]" strokeWidth={2} />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t.login.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 pr-12 h-[54px] sm:h-[58px] bg-slate-50 border-transparent rounded-[16px] text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-primary transition-colors outline-none focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-[20px] w-[20px]" strokeWidth={2.25} />
                ) : (
                  <Eye className="h-[20px] w-[20px]" strokeWidth={2.25} />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-3 group/check cursor-pointer">
              <Checkbox id="remember" className="w-5 h-5 rounded-full border-2 border-slate-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all" />
              <label htmlFor="remember" className="text-xs sm:text-sm text-slate-600 font-medium cursor-pointer group-hover/check:text-slate-900 transition-colors">
                {t.login.keepLoggedIn}
              </label>
            </div>
            <Link to="#" className="text-xs sm:text-sm font-bold text-primary hover:text-slate-900 hover:underline transition-all">
              {t.login.forgot}
            </Link>
          </div>

          <Button type="submit" className="w-full h-[60px] sm:h-[64px] rounded-[18px] bg-primary hover:bg-slate-900 text-white font-bold text-base sm:text-lg shadow-xl shadow-primary/20 transition-all duration-300 active:scale-[0.98] mt-4">
            {t.login.signIn}
          </Button>
        </form>

        {/* Footer - Copyright */}
        <div className="relative lg:absolute bottom-0 lg:bottom-6 left-0 right-0 text-center text-slate-300 text-xs font-semibold tracking-wider uppercase mt-auto pt-10 pb-6 lg:pb-0">
          {t.login.copyright}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;


