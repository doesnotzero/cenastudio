import AppNavBar from "@/components/AppNavBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { CHECKOUT_MODAL_PLAN, planDisplayLabel } from "@/lib/plans";
import { useApp } from "@/contexts/AppContext";
import { openBillingPortal, ApiError } from "@/lib/api";
import { CalendarClock, Crown, LogOut, ShieldCheck, UserRound, Zap, Settings, Users } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

function formatDate(value: string | null | undefined) {
  if (!value) return "Sem data definida";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function ProfileContent() {
  const { user, plan, logout } = useAuth();
  const { openModal, selectPlan } = useApp();
  const [, setLocation] = useLocation();

  const planLabel = plan
    ? planDisplayLabel(plan.planId, plan.planName, plan.status, plan.trialEndsAt)
    : "Plano não carregado";

  const handlePlanAction = async () => {
    if (!plan || plan.planId === "free" || plan.status === "trial") {
      selectPlan(CHECKOUT_MODAL_PLAN);
      openModal("checkout");
      return;
    }

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
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-frame-black text-frame-white font-frame-body flex flex-col">
      <AppNavBar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 md:py-16 space-y-8">
        <div className="border-b border-frame-gray-3 pb-6">
          <p className="frame-label mb-2">// Conta</p>
          <h1 className="frame-title text-[clamp(2.2rem,4vw,3.8rem)]">
            PERFIL DO <em className="not-italic text-transparent [-webkit-text-stroke:1px_#f5f0e8]">ESTUDIO</em>
          </h1>
          <p className="text-frame-gray-light text-sm mt-3 max-w-2xl">
            Dados da conta, acesso atual e plano ativo para operar o Frame.AI.
          </p>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-6">
          <div className="border border-frame-gray-3 bg-frame-gray-1/20 p-6">
            <div className="flex items-start gap-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                  user?.role === "admin"
                    ? "bg-frame-gold text-frame-black"
                    : "bg-frame-orange text-frame-black"
                }`}
              >
                {(user?.name ?? user?.email ?? "F").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-frame-mono text-[0.58rem] tracking-[0.18em] text-frame-orange uppercase">
                  Usuario ativo
                </p>
                <h2 className="frame-title text-[2rem] mt-1 truncate">
                  {user?.name || "Conta Frame.AI"}
                </h2>
                <p className="text-frame-gray-light text-sm break-all">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
              <div className="border border-frame-gray-3 bg-frame-black/30 p-4">
                <UserRound className="w-5 h-5 text-frame-orange mb-3" />
                <p className="font-frame-mono text-[0.58rem] tracking-[0.16em] uppercase text-frame-gray-light">
                  Tipo de conta
                </p>
                <p className="text-lg font-semibold mt-1">
                  {user?.role === "admin" ? "Administrador" : "Usuario"}
                </p>
              </div>
              <div className="border border-frame-gray-3 bg-frame-black/30 p-4">
                <ShieldCheck className="w-5 h-5 text-frame-orange mb-3" />
                <p className="font-frame-mono text-[0.58rem] tracking-[0.16em] uppercase text-frame-gray-light">
                  Acesso
                </p>
                <p className="text-lg font-semibold mt-1">
                  {user?.role === "admin" ? "Total" : "Workspace"}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button type="button" onClick={() => setLocation("/dashboard")} className="frame-btn-primary flex-1">
                Abrir painel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="frame-btn-ghost flex-1 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>

          {user?.role === "admin" && (
            <div className="border border-frame-gold/40 bg-frame-gold/5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-frame-mono text-[0.58rem] tracking-[0.18em] text-frame-gold uppercase">
                    Administracao
                  </p>
                  <h2 className="frame-title text-[2rem] mt-1">GERENCIAR CONTAS</h2>
                  <p className="text-frame-gray-light text-sm mt-2 max-w-md">
                    Promote e rebaixe administradores, altere planos e monitore todos os usuarios da plataforma.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setLocation("/admin/gerenciar")}
                  className="frame-btn-primary flex items-center gap-2 shrink-0"
                >
                  <Users className="w-4 h-4" />
                  Gerenciar
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="border border-frame-gold/30 bg-frame-black/30 p-4">
                  <Settings className="w-5 h-5 text-frame-gold mb-3" />
                  <p className="font-frame-mono text-[0.55rem] tracking-[0.16em] uppercase text-frame-gray-light">
                    Painel Admin
                  </p>
                  <button
                    type="button"
                    onClick={() => setLocation("/admin")}
                    className="text-frame-gold underline underline-offset-4 text-sm mt-2 hover:text-frame-orange transition"
                  >
                    Acessar dashboard →
                  </button>
                </div>
                <div className="border border-frame-gold/30 bg-frame-black/30 p-4">
                  <Users className="w-5 h-5 text-frame-gold mb-3" />
                  <p className="font-frame-mono text-[0.55rem] tracking-[0.16em] uppercase text-frame-gray-light">
                    Usuarios
                  </p>
                  <p className="text-lg font-semibold mt-1 text-frame-gold">
                    Acesso total
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="border border-frame-gray-3 bg-frame-gray-1/20 p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <p className="font-frame-mono text-[0.58rem] tracking-[0.18em] text-frame-orange uppercase">
                  Plano atual
                </p>
                <h2 className="frame-title text-[2.4rem] mt-1">{planLabel}</h2>
                <p className="text-frame-gray-light text-sm mt-2">
                  Novos usuarios entram com teste Pro por 14 dias. Administradores mantem acesso total.
                </p>
              </div>
              <button type="button" onClick={handlePlanAction} className="frame-btn-ghost shrink-0">
                Gerenciar plano
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="border border-frame-gray-3 bg-frame-black/30 p-4">
                <Crown className="w-5 h-5 text-frame-gold mb-3" />
                <p className="font-frame-mono text-[0.55rem] tracking-[0.16em] uppercase text-frame-gray-light">
                  Status
                </p>
                <p className="text-lg font-semibold mt-1">{plan?.status || "—"}</p>
              </div>
              <div className="border border-frame-gray-3 bg-frame-black/30 p-4">
                <Zap className="w-5 h-5 text-frame-orange mb-3" />
                <p className="font-frame-mono text-[0.55rem] tracking-[0.16em] uppercase text-frame-gray-light">
                  Geracoes
                </p>
                <p className="text-lg font-semibold mt-1">
                  {plan?.generationLimit === -1 ? "Ilimitado" : `${plan?.generationLimit ?? 0}/mes`}
                </p>
              </div>
              <div className="border border-frame-gray-3 bg-frame-black/30 p-4">
                <CalendarClock className="w-5 h-5 text-frame-orange mb-3" />
                <p className="font-frame-mono text-[0.55rem] tracking-[0.16em] uppercase text-frame-gray-light">
                  Trial ate
                </p>
                <p className="text-sm font-semibold mt-1">{formatDate(plan?.trialEndsAt)}</p>
              </div>
            </div>

            <div className="border-t border-frame-gray-3 pt-5">
              <p className="font-frame-mono text-[0.58rem] tracking-[0.18em] uppercase text-frame-gray-light mb-3">
                Recursos liberados
              </p>
              <div className="flex flex-wrap gap-2">
                {(plan?.features?.length ? plan.features : ["Ferramentas IA", "Projetos", "Historico"]).map(
                  (feature) => (
                    <span key={feature} className="frame-tag">
                      {feature}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
