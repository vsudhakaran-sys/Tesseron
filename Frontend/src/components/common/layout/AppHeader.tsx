import { LogOut, Settings, User, Menu, X, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useNotifications, markAllRead } from "@/hooks/useNotifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/ui/dropdown-menu";
import { Button } from "@/components/common/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/common/ui/avatar";
import ReactCountryFlag from "react-country-flag";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/common/ui/breadcrumb";

const languages = [
  { code: "en", label: "English", countryCode: "GB" },
  { code: "nl", label: "Dutch", countryCode: "NL" },
] as const;

function formatRelativeTime(date: Date): string {
  const diff = Math.round((Date.now() - date.getTime()) / 1000); // seconds
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""} ago`;
}

interface AppHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function AppHeader({ isCollapsed, setIsCollapsed }: AppHeaderProps) {
  const { locale, setLocale, t } = useLanguage();
  const location = useLocation();
  const { notifications, unreadCount } = useNotifications();

  const currentLanguage = languages.find((l) => l.code === locale);

  // Generate breadcrumbs from path
  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  const getBreadcrumbLabel = (segment: string) => {
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  };

  return (
    <div className="px-4 lg:px-6 pt-0 pb-2 z-50 w-full">
      <header className="h-16 bg-white border border-slate-200 shadow-sm rounded-b-2xl flex items-center justify-between px-4 sm:px-6 gap-4 transition-all duration-300">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="lg:hidden h-9 w-9 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search bar - premium styling from HEAD with translations from dev */}
          <div className="relative hidden sm:block w-48 lg:w-56 focus-within:w-[calc(100%-2rem)] max-w-sm transition-all duration-500 ease-out group/search">
            <div className="absolute inset-y-0 left-0 flex items-center pl-[14px] pointer-events-none text-slate-400 group-focus-within/search:text-primary transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            </div>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200/50 outline-none text-sm font-medium text-slate-800 rounded-xl h-10 pl-10 pr-4 placeholder:text-slate-400 focus:bg-white focus:border-primary/20 focus:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)] transition-all duration-300" 
              placeholder={t.header.search} 
            />
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center justify-end gap-2 sm:gap-4 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Notifications */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white border-2 border-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[320px] p-0">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <span className="text-sm font-semibold text-slate-800">Notifications</span>
                  <button
                    onClick={markAllRead}
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[400px]">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-slate-500">
                      No notifications
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {notifications.map((n) => (
                        <div key={n.id} className={`flex flex-col gap-1 p-4 border-b border-slate-50 last:border-0 ${!n.read ? "bg-primary/5" : ""}`}>
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-sm font-bold text-slate-800">{n.title}</span>
                            <span className="text-xs text-slate-500 whitespace-nowrap">{formatRelativeTime(n.timestamp)}</span>
                          </div>
                          <span className="text-xs text-slate-600 line-clamp-2">{n.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Menu */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full ml-0.5 ring-2 ring-transparent hover:ring-slate-200 transition-all">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/profile.png" alt="Profile" />
                    <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-bold">
                      AS
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="gap-2 cursor-pointer text-sm">
                  <User className="h-4 w-4" />
                  <span>{t.header.myProfile}</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2 cursor-pointer text-sm">
                  <Link to="/settings">
                    <Settings className="h-4 w-4" />
                    <span>{t.header.settings}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="gap-2 cursor-pointer text-sm text-destructive"
                  onClick={() => {
                    localStorage.removeItem("TESSERON_token");
                    localStorage.removeItem("TESSERON_user");
                    window.location.href = "/login";
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t.header.logOut}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </div>
  );
}





