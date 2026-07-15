import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/utils";
import {
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
  Car,
  User,
  Wrench,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}


interface AppSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function AppSidebar({ isCollapsed, setIsCollapsed }: AppSidebarProps) {
  const { t } = useLanguage();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const navItems: NavItem[] = [
    {
      label: t.nav.dashboard,
      href: "/",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      label: t.nav.customers,
      href: "/customers",
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: t.nav.vehicles || "Vehicles",
      href: "/vehicles",
      icon: <Car className="h-4 w-4" />,
    },
    {
      label: t.nav.drivers || "Drivers",
      href: "/drivers",
      icon: <User className="h-4 w-4" />,
    },
    {
      label: "Maintenance",
      href: "/maintenance",
      icon: <Wrench className="h-4 w-4" />,
    },
  ];

  const toggleSection = (label: string) => {
    if (isCollapsed) {
      setIsCollapsed(false); // Auto-expand when trying to open a section
    }
    setExpandedSections((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };
  
  const isChildActive = (children?: { href: string }[]) =>
    children?.some((child) => location.pathname.startsWith(child.href));

  return (
    <>
      {/* Overlay for mobile - only show when isCollapsed is true on mobile (means sidebar is visible) */}
      {isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={() => setIsCollapsed(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "shrink-0 fixed lg:sticky top-0 left-0 z-40 h-[100dvh] bg-white xl:border-r border-slate-200 text-slate-700 flex flex-col transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
          isCollapsed ? "w-64 translate-x-0 lg:w-[90px] xl:w-[74px] items-center" : "w-64 -translate-x-full lg:translate-x-0 lg:w-64"
        )}
      >
        {/* Logo and Toggle Header */}
        <div className={cn(
          "py-4 flex items-center transition-all duration-300 min-h-[60px] w-full relative",
          isCollapsed ? "px-0 justify-center" : "px-6 justify-between"
        )}>
          <Link 
            to="/" 
            className={cn(
              "flex items-center transition-all duration-300 overflow-hidden whitespace-nowrap group", 
              isCollapsed ? "lg:opacity-0 lg:max-w-0" : "opacity-100 max-w-[150px]"
            )}
          >
             <div className="shrink-0 flex items-center justify-center">
              <img 
                src="/TESSERON.png" 
                alt="TESSERON" 
                className={cn(
                  "h-14 w-auto object-contain transition-all duration-300 -ml-1.5", 
                  isCollapsed && "hidden"
                )} 
                onError={(e) => { 
                  e.currentTarget.style.display = 'none'; 
                  e.currentTarget.nextElementSibling?.classList.remove('hidden'); 
                  e.currentTarget.nextElementSibling?.classList.add('flex');
                }} 
              />
              <span className={cn(
                "hidden items-center justify-center rounded-xl bg-primary/10 text-primary font-black text-2xl leading-none tracking-tighter h-11 w-11",
                isCollapsed && "hidden"
              )}>T</span>
            </div>
          </Link>
          
          {/* Logo-sm specifically for collapsed state as requested */}
          {isCollapsed && (
            <div className="lg:flex hidden h-9 w-9 items-center justify-center transition-all duration-300">
               <img 
                src="/logo-sm.png" 
                alt="TESSERON" 
                className="h-8 w-8 object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-300 shrink-0",
              isCollapsed ? "lg:absolute lg:-right-[14px] lg:top-1/2 lg:-translate-y-1/2 lg:z-50 lg:h-[28px] lg:w-[28px] lg:flex lg:items-center lg:justify-center lg:rounded-full lg:border lg:border-slate-200 lg:bg-white lg:text-slate-400 lg:hover:text-primary lg:hover:border-primary lg:shadow-sm lg:p-0 lg:transition-all"
              : "lg:p-2"
            )}
            aria-label="Toggle Menu"
          >
            {/* Desktop Icons */}
            <div className="lg:block hidden">
              {isCollapsed ? (
                <PanelLeftOpen className="h-[14px] w-[14px] stroke-[2.5px]" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </div>
            {/* Mobile/Toggle Icons */}
            <div className="lg:hidden block">
              {isCollapsed ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </div>
          </button>
        </div>

        <div className="border-t border-slate-100 mx-4" />

        {/* Navigation - scrollable area */}
        <nav className={cn(
          "flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-4 transition-all duration-300 w-full",
          isCollapsed ? "px-3 xl:px-4" : "px-4 xl:px-5"
        )}>
          <ul className="space-y-1.5 flex flex-col items-center w-full">
            {navItems.map((item) => (
              <li key={item.label} className="w-full relative group/item">
                {item.children ? (
                  <div className="w-full">
                    <button
                      onClick={() => toggleSection(item.label)}
                      title={isCollapsed ? item.label : undefined}
                      className={cn(
                        "relative w-full flex items-center rounded-xl text-sm font-semibold transition-all duration-300 outline-none hover:ring-2 hover:ring-primary/10",
                        isCollapsed ? "justify-center p-[14px]" : "justify-between px-4 py-[14px]",
                        isChildActive(item.children)
                          ? "text-primary"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      )}
                    >
                      <span className={cn(
                        "flex items-center",
                        !isCollapsed && "gap-3.5",
                      )}>
                        <span className={cn(
                          "rounded-lg transition-colors flex items-center justify-center shrink-0",
                          isCollapsed ? "p-0" : "p-1.5",
                          isChildActive(item.children)
                            ? cn("text-primary", !isCollapsed && "bg-primary/10")
                            : "bg-slate-100 text-slate-500"
                        )}>
                          {item.icon}
                        </span>
                        {!isCollapsed && <span className="truncate whitespace-nowrap transition-all duration-300">{item.label}</span>}
                      </span>
                      {!isCollapsed && (
                        expandedSections.includes(item.label) ? (
                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 opacity-50 transition-transform" />
                        )
                      )}
                    </button>
                    {!isCollapsed && expandedSections.includes(item.label) && (
                      <ul className="mt-1.5 ml-5 pl-4 border-l-2 border-slate-100 space-y-1 animate-in slide-in-from-left-2 duration-300">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              to={child.href}
                              onClick={() => { if (window.innerWidth < 1024) setIsCollapsed(false); }}
                              className={cn(
                                "block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                                isActive(child.href)
                                  ? "bg-primary/10 text-primary"
                                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href!}
                    onClick={() => { if (window.innerWidth < 1024) setIsCollapsed(false); }}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      "relative flex items-center rounded-xl text-sm font-semibold transition-all duration-300 outline-none w-full border border-transparent",
                      isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                      isActive(item.href!)
                        ? "text-primary font-semibold"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <span className={cn(
                      "rounded-lg transition-colors flex items-center justify-center shrink-0",
                      isCollapsed ? "p-0" : "p-1.5",
                      isActive(item.href!)
                        ? cn("text-primary", !isCollapsed && "bg-primary/10")
                        : cn("text-slate-400 group-hover/item:text-primary", !isCollapsed && "bg-slate-100")
                    )}>
                      {item.icon}
                    </span>
                    <span className={cn(
                      "transition-all duration-300 whitespace-nowrap overflow-hidden",
                      isCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-xs ml-0"
                    )}>
                      {item.label}
                    </span>
                    {isActive(item.href!) && (
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-primary" />
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className={cn(
          "py-5 border-t border-slate-100 bg-white w-full transition-all duration-300 z-10 relative",
          isCollapsed ? "px-3 xl:px-4" : "px-4 xl:px-5"
        )}>
          <ul className="space-y-1.5 w-full flex flex-col items-center">

            {/* Settings (admin & system settings) */}
            <li className="w-full">
              <Link
                to="/settings"
                title={isCollapsed ? t.nav.settings : undefined}
                className={cn(
                  "relative flex items-center rounded-xl text-sm font-semibold transition-all duration-300 w-full outline-none border border-transparent",
                  isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                  isActive("/settings")
                    ? "text-primary font-semibold"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <span className={cn(
                  "rounded-[10px] transition-colors flex items-center justify-center shrink-0",
                  isCollapsed ? "p-0" : "p-1.5",
                  isActive("/settings")
                    ? cn("text-primary", !isCollapsed && "bg-primary/10")
                    : cn("text-slate-400 group-hover:text-primary", !isCollapsed && "bg-slate-100")
                )}>
                  <Settings className="h-4 w-4" />
                </span>
                {!isCollapsed && <span className="truncate whitespace-nowrap">{t.nav.settings}</span>}
                {isActive("/settings") && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-primary" />
                )}
              </Link>
            </li>

            {/* Logout Button */}
            <li className="w-full">
              <button
                onClick={() => {
                  localStorage.removeItem("TESSERON_token");
                  localStorage.setItem("user", JSON.stringify({ email: "hari@plmfleet.com", role: "ADMIN" }));
                  localStorage.removeItem("TESSERON_user");
                  window.location.href = "/login";
                }}
                className={cn(
                  "flex items-center rounded-xl text-sm font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300 w-full border border-transparent hover:border-rose-100 group/logout",
                  isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
                )}
                title={isCollapsed ? "Logout" : undefined}
              >
                <span className={cn(
                  "rounded-[10px] transition-colors flex items-center justify-center shrink-0",
                  isCollapsed ? "p-0" : "p-1.5 bg-rose-50 group-hover/logout:bg-rose-100/50"
                )}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </span>
                <span className={cn(
                  "truncate transition-all duration-300 whitespace-nowrap",
                  isCollapsed ? "opacity-0 max-w-0" : "opacity-100"
                )}>
                  {t.nav.logout}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}


