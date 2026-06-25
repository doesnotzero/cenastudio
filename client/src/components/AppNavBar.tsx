import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, openBillingPortal } from "@/lib/api";
import { CHECKOUT_MODAL_PLAN, planDisplayLabel } from "@/lib/plans";
import { LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface AppNavBarProps {
  children?: React.ReactNode;
}

export default function AppNavBar({ children }: AppNavBarProps) {
  const { logout, user, plan } = useAuth();
  const { openModal, selectPlan } = useApp();
  const [location, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const planLabel = plan
    ? planDisplayLabel(plan.planId, plan.planName, plan.status, plan.trialEndsAt)
    : "—";

  const isAdmin = user?.role === "admin";

  const handleBadgeClick = async () => {
    if (!plan) return;

    const isFreeOrTrial = plan.planId === "free" || plan.status === "trial";
    const isPaid = plan.planId === "pro" || plan.planId === "studio";

    if (isFreeOrTrial) {
      selectPlan(CHECKOUT_MODAL_PLAN);
      openModal("checkout");
      return;
    }

    if (isPaid) {
      try {
        await openBillingPortal();
      } catch (error) {
        const msg =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Erro ao abrir portal";
        toast.error(msg);
      }
    }
  };

  const navLink = (href: string, label: string) => {
    const active = location === href || location.startsWith(href + "/");
    return (
      <motion.button
        type="button"
        onClick={() => setLocation(href)}
        className={`frame-nav-link ${active ? "active" : ""}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.button>
    );
  };

  return (
    <header className="frame-nav">
      <button
        type="button"
        onClick={() => setLocation("/tools")}
        className="font-frame-display text-[1.55rem] tracking-[0.1em] text-frame-white bg-transparent border-none"
      >
        FRAME<span className="text-frame-orange">.</span>AI
      </button>

      <nav className="hidden md:flex items-center gap-5">
        {navLink("/dashboard", "Painel")}
        {navLink("/tools", "Ferramentas")}
        {navLink("/clients", "CRM")}
        {navLink("/pipeline", "Pipeline")}
        {navLink("/files", "Arquivos")}
        {navLink("/video-reviews", "Reviews")}
        {navLink("/collaborators", "Equipe")}
        {navLink("/analytics", "Analytics")}
        {navLink("/profile", "Conta")}
        {isAdmin && navLink("/admin", "Admin")}
      </nav>

      <div className="flex items-center gap-2.5">
        {children}
        {user && (
          <button
            type="button"
            onClick={() => setLocation("/profile")}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.68rem] font-bold shrink-0 ${
              isAdmin ? "bg-frame-gold text-frame-black" : "bg-frame-orange text-frame-black"
            }`}
            title="Abrir conta"
          >
            {(user.name ?? user.email).charAt(0).toUpperCase()}
          </button>
        )}
        <span className="hidden sm:inline font-frame-mono text-[0.58rem] tracking-[0.09em] uppercase text-frame-gray-light">
          {user?.name ?? user?.email}
        </span>
        <button type="button" onClick={handleBadgeClick} className="frame-badge">
          {planLabel}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="font-frame-mono text-[0.58rem] tracking-[0.09em] uppercase bg-transparent border border-frame-gray-3 text-frame-gray-light px-2.5 py-1.5 transition hover:border-frame-red hover:text-frame-red flex items-center gap-1.5"
        >
          <LogOut className="w-3 h-3" />
          Sair
        </button>
      </div>
    </header>
  );
}
