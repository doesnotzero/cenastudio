import { useState, useEffect, useRef } from "react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { planDisplayLabel } from "@/lib/plans";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { LogOut, Sun, Moon, Menu, X, Search } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import NotificationsPopover from "@/components/NotificationsPopover";
import BrandLogo from "@/components/BrandLogo";
import AccessibilityFontControls from "@/components/AccessibilityFontControls";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useProject } from "@/contexts/ProjectContext";

interface AppNavBarProps {
  children?: React.ReactNode;
}

export default function AppNavBar({ children }: AppNavBarProps) {
  const { logout, user, plan } = useAuth();
  const { openModal, selectPlan } = useApp();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const { projects, activeProject } = useProject();
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on Esc key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const handleOpenCommandPalette = () => {
    window.dispatchEvent(new Event("cena:open-command-palette"));
  };

  const planLabel = plan
    ? planDisplayLabel(plan.planId, plan.planName, plan.status, plan.trialEndsAt)
    : "—";

  const routeProjectId = Number(location.match(/^\/project\/(\d+)/)?.[1] || 0);
  const contextProject = projects.find((project) => project.id === routeProjectId) || activeProject;

  const handleBadgeClick = () => {
    if (!plan) return;

    const isFreeOrTrial = plan.planId === "free" || plan.status === "trial";

    if (isFreeOrTrial) {
      selectPlan("produtora");
      openModal("checkout");
      return;
    }

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Quero falar sobre meu plano Cena Studio.")}`,
      "_blank",
    );
  };

  const navLink = (href: string, label: string, icon: string, tourId?: string) => {
    const commercialRoutes = ["/clients", "/pipeline", "/interactions", "/proposals"];
    const active = location === href || location.startsWith(href + "/") ||
      (href === "/commercial" && commercialRoutes.some((route) => location === route || location.startsWith(`${route}/`))) ||
      (href === "/projects" && location.startsWith("/project/"));
    return (
      <motion.button
        type="button"
        onClick={() => {
          setLocation(href);
          setMobileMenuOpen(false);
        }}
        className={`frame-nav-link ${active ? "active" : ""}`}
        data-tour={tourId}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        style={{ minHeight: "44px" }} // Accessibility: touch target ≥ 44px
      >
        <span className="mr-1.5">{icon}</span>
        {label}
      </motion.button>
    );
  };

  // 5 primary navigation tabs: HOME, CLIENTS, JOBS, STUDIO, FINANCE
  const primaryNavItems = [
    ["/dashboard", t("app.nav.dashboard") as string, "🏠", "dashboard"],
    ["/commercial", t("app.nav.clients") as string, "👥", "clients"],
    ["/projects", "JOBS", "🎬", "projects"],
    ["/tools", "STUDIO", "🤖", "studio"],
    ["/analytics", t("app.nav.analytics") as string, "💰", "analytics"],
  ] as const;

  return (
    <header className="frame-nav">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="xl:hidden flex h-11 w-11 items-center justify-center border border-frame-gray-3 text-frame-gray-light hover:text-frame-orange hover:border-frame-orange transition"
          aria-label={mobileMenuOpen ? t("app.nav.closeMenu") as string : t("app.nav.openMenu") as string}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => {
            setLocation("/dashboard");
            setMobileMenuOpen(false);
          }}
          className="bg-transparent border-none"
          aria-label={t("app.nav.backToDashboard") as string}
        >
          <BrandLogo compact className="scale-90 origin-left" />
        </button>
      </div>

      <nav className="hidden xl:flex items-center gap-4">
        {primaryNavItems.map(([href, label, icon, tourId]) => (
          <span key={href}>{navLink(href, label, icon, tourId)}</span>
        ))}
      </nav>

      <div className="flex items-center gap-2.5">
        {children}
        {user && contextProject && (
          <label className="hidden xl:flex min-w-0 items-center border border-frame-gray-3 bg-frame-black/40 px-2 py-1.5" title={t("app.nav.activeProject") as string}>
            <span className="mr-2 font-frame-mono text-[0.52rem] uppercase tracking-[0.12em] text-frame-orange">JOB</span>
            <select
              value={contextProject.id}
              onChange={(event) => setLocation(`/project/${event.target.value}`)}
              className="max-w-[118px] 2xl:max-w-[150px] bg-transparent text-[0.68rem] font-semibold text-frame-white outline-none"
              aria-label={t("app.nav.activeProject") as string}
            >
              {projects.map((project) => <option key={project.id} value={project.id} className="bg-frame-black">{project.name}</option>)}
            </select>
          </label>
        )}
        {user && (
          <button
            type="button"
            onClick={handleOpenCommandPalette}
            className="command-palette-trigger inline-flex"
            title={t("app.nav.search") as string}
            aria-label={t("app.nav.openSearch") as string}
          >
            <Search className="h-3.5 w-3.5" />
            <kbd className="hidden lg:inline">⌘K</kbd>
          </button>
        )}
        {user && (
          <button
            type="button"
            onClick={() => setLocation("/profile")}
            className="hidden sm:flex items-center gap-2.5 group"
            title="Abrir conta"
            data-tour="profile"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[0.75rem] font-bold shrink-0 transition group-hover:scale-105 bg-frame-orange text-frame-black">
              {(user.name ?? user.email).charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="font-frame-mono text-[0.6rem] tracking-[0.06em] text-frame-white truncate max-w-[100px]">
                {user?.name ?? user?.email}
              </div>
              <div className="font-frame-mono text-[0.62rem] tracking-[0.08em] text-frame-gray-light">
                {user?.email}
              </div>
            </div>
          </button>
        )}
        <div className="hidden sm:flex items-center">
          <LanguageSwitcher compact />
        </div>
        {user && <NotificationsPopover />}
        {user && <div className="hidden sm:block"><AccessibilityFontControls /></div>}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 border border-frame-gray-3 text-frame-gray-light hover:text-frame-orange hover:border-frame-orange transition rounded-none"
          title={theme === "dark" ? t("app.nav.darkMode") as string : t("app.nav.lightMode") as string}
        >
          {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
        <button type="button" onClick={handleBadgeClick} className="frame-badge hidden md:inline-flex">
          {planLabel}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="hidden sm:flex font-frame-mono text-[0.64rem] tracking-[0.09em] uppercase bg-transparent border border-frame-gray-3 text-frame-gray-light px-2.5 py-1.5 transition hover:border-frame-red hover:text-frame-red items-center gap-1.5"
        >
          <LogOut className="w-3 h-3" />
          {t("app.nav.logout") as string}
        </button>
      </div>

      {/* Mobile menu with animations, backdrop, and accessibility features */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop with glass effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[64px] z-[499] bg-black/30 backdrop-blur-sm xl:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile menu dropdown */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute left-0 right-0 top-full z-[500] xl:hidden border-b border-frame-gray-2 bg-frame-black/98 backdrop-blur-xl px-4 py-4 shadow-2xl"
            >
              {/* Primary navigation - 5 tabs in 2-column grid */}
              <nav className="grid grid-cols-2 gap-2">
                {primaryNavItems.map(([href, label, icon, tourId]) => (
                  <span key={href} className="block">{navLink(href, label, icon, tourId)}</span>
                ))}
              </nav>

              {/* Additional mobile-only controls */}
              <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
                <div className="min-h-[44px] border border-frame-gray-3 px-2 flex items-center justify-center">
                  <LanguageSwitcher compact />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLocation("/profile");
                    setMobileMenuOpen(false);
                  }}
                  className="min-h-[44px] border border-frame-gray-3 px-3 font-frame-mono text-[0.62rem] uppercase tracking-[0.1em] text-frame-gray-light hover:text-frame-orange hover:border-frame-orange transition"
                >
                  {t("app.nav.myAccount") as string}
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:hidden">
                <button
                  type="button"
                  onClick={handleBadgeClick}
                  className="min-h-[44px] border border-frame-orange/50 px-3 font-frame-mono text-[0.62rem] uppercase tracking-[0.1em] text-frame-orange hover:bg-frame-orange/10 transition"
                >
                  {t("app.nav.plan") as string} {planLabel}
                </button>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 w-full min-h-[44px] font-frame-mono text-[0.62rem] tracking-[0.12em] uppercase bg-transparent border border-frame-gray-3 text-frame-gray-light px-3 py-2.5 transition hover:border-frame-red hover:text-frame-red flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                {t("app.nav.logout") as string}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
