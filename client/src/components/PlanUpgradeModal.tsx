/**
 * PlanUpgradeModal Component
 *
 * Full-featured modal for plan selection and upgrade.
 * Shows plan comparison, pricing, and Stripe checkout integration.
 *
 * @example
 * ```tsx
 * const [showModal, setShowModal] = useState(false);
 *
 * <button onClick={() => setShowModal(true)}>Upgrade</button>
 * <PlanUpgradeModal
 *   open={showModal}
 *   onClose={() => setShowModal(false)}
 *   currentPlan="free"
 * />
 * ```
 */

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { PlanMode } from "@/types/plan";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap, Sparkles, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface PlanUpgradeModalProps {
  /** Whether modal is open */
  open: boolean;

  /** Callback when modal closes */
  onClose: () => void;

  /** User's current plan */
  currentPlan: PlanMode;

  /** Feature that triggered the upgrade (optional) */
  triggerFeature?: string;

  /** Recommended plan to highlight (optional) */
  recommendedPlan?: "pro" | "studio";

  /** Callback after successful upgrade */
  onUpgradeSuccess?: (plan: "pro" | "studio") => void;
}

/**
 * Plan features and pricing
 */
const PLAN_DETAILS = {
  free: {
    name: "Free",
    price: 0,
    priceAnnual: 0,
    icon: <Zap className="h-6 w-6" />,
    description: "Para começar sua jornada audiovisual",
    features: [
      "5 clientes máximo",
      "Projetos ilimitados",
      "8 ferramentas IA básicas",
      "Armazenamento 1GB",
      "Suporte comunidade",
    ],
    limitations: [
      "Sem Pipeline View",
      "Sem Video Reviews",
      "Sem Commercial Hub",
      "Sem Colaboração em tempo real",
    ],
  },
  pro: {
    name: "Pro",
    price: 199,
    priceAnnual: 1990, // 2 meses grátis
    icon: <Sparkles className="h-6 w-6" />,
    description: "Para profissionais e freelancers",
    badge: "Mais Popular",
    features: [
      "50 clientes máximo",
      "Projetos ilimitados",
      "12 ferramentas IA completas",
      "Pipeline View (Kanban)",
      "Video Reviews (timestamped)",
      "Colaboração (5 membros)",
      "Exportação avançada",
      "Armazenamento 50GB",
      "Glow effects no design",
      "Suporte prioritário",
    ],
    highlights: [
      "Pipeline View",
      "Video Reviews",
      "Colaboração",
    ],
  },
  studio: {
    name: "Studio",
    price: 399,
    priceAnnual: 3990, // 2 meses grátis
    icon: <Crown className="h-6 w-6" />,
    description: "Para produtoras e agências",
    badge: "Completo",
    features: [
      "Clientes ilimitados",
      "Projetos ilimitados",
      "12 ferramentas IA completas",
      "Pipeline View (Kanban)",
      "Video Reviews (timestamped)",
      "Colaboração ilimitada",
      "Commercial Hub completo",
      "Propostas e Contratos IA",
      "Módulo Financeiro (dourado)",
      "Team Management ilimitado",
      "Analytics avançado",
      "API access",
      "Custom branding",
      "Armazenamento 500GB",
      "Dual accent (laranja + dourado)",
      "Suporte premium",
    ],
    highlights: [
      "Commercial Hub",
      "Módulo Financeiro",
      "Team ilimitado",
      "API Access",
    ],
  },
};

/**
 * PlanUpgradeModal Component
 */
export function PlanUpgradeModal({
  open,
  onClose,
  currentPlan,
  triggerFeature,
  recommendedPlan = "pro",
  onUpgradeSuccess,
}: PlanUpgradeModalProps) {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<"pro" | "studio">(recommendedPlan);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para fazer upgrade");
      return;
    }

    setIsLoading(true);

    try {
      // Get Stripe checkout URL
      const priceId = billingPeriod === "monthly"
        ? (selectedPlan === "pro" ? process.env.STRIPE_PRICE_PRO : process.env.STRIPE_PRICE_STUDIO)
        : (selectedPlan === "pro" ? process.env.STRIPE_PRICE_PRO_ANNUAL : process.env.STRIPE_PRICE_STUDIO_ANNUAL);

      // TODO: Implement Stripe checkout
      // For now, redirect to pricing page
      window.location.href = `/pricing?plan=${selectedPlan}&period=${billingPeriod}`;

      if (onUpgradeSuccess) {
        onUpgradeSuccess(selectedPlan);
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("Erro ao processar upgrade. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const proDetails = PLAN_DETAILS.pro;
  const studioDetails = PLAN_DETAILS.studio;

  const selectedDetails = selectedPlan === "pro" ? proDetails : studioDetails;
  const selectedPrice = billingPeriod === "monthly"
    ? selectedDetails.price
    : Math.round(selectedDetails.priceAnnual / 12);

  const savings = billingPeriod === "annual"
    ? selectedDetails.price * 2
    : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Escolha seu plano</DialogTitle>
          <DialogDescription>
            {triggerFeature
              ? `Upgrade para acessar ${triggerFeature} e muito mais`
              : "Desbloqueie todo o potencial do CenaStudio"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Billing Period Toggle */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={billingPeriod === "monthly" ? "default" : "outline"}
              onClick={() => setBillingPeriod("monthly")}
              size="sm"
            >
              Mensal
            </Button>
            <Button
              variant={billingPeriod === "annual" ? "default" : "outline"}
              onClick={() => setBillingPeriod("annual")}
              size="sm"
            >
              Anual
              {billingPeriod === "annual" && (
                <Badge variant="secondary" className="ml-2">
                  -17% 🎉
                </Badge>
              )}
            </Button>
          </div>

          {/* Plan Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pro Plan */}
            <Card
              className={`cursor-pointer transition-all ${
                selectedPlan === "pro"
                  ? "ring-2 ring-orange-500 shadow-lg"
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedPlan("pro")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-orange-500">
                      {proDetails.icon}
                    </div>
                    <CardTitle>{proDetails.name}</CardTitle>
                  </div>
                  {proDetails.badge && (
                    <Badge variant="secondary">{proDetails.badge}</Badge>
                  )}
                </div>
                <CardDescription>{proDetails.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      R$ {billingPeriod === "monthly" ? proDetails.price : Math.round(proDetails.priceAnnual / 12)}
                    </span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  {billingPeriod === "annual" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Cobrado R$ {proDetails.priceAnnual}/ano • Economize R$ {proDetails.price * 2}
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  {proDetails.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {proDetails.highlights && (
                  <div className="mt-4 p-3 bg-orange-500/10 rounded-lg">
                    <p className="text-xs font-medium text-orange-500 mb-2">
                      Destaques:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {proDetails.highlights.map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Studio Plan */}
            <Card
              className={`cursor-pointer transition-all ${
                selectedPlan === "studio"
                  ? "ring-2 ring-orange-500 shadow-lg"
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedPlan("studio")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-orange-500">
                      {studioDetails.icon}
                    </div>
                    <CardTitle>{studioDetails.name}</CardTitle>
                  </div>
                  {studioDetails.badge && (
                    <Badge>{studioDetails.badge}</Badge>
                  )}
                </div>
                <CardDescription>{studioDetails.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      R$ {billingPeriod === "monthly" ? studioDetails.price : Math.round(studioDetails.priceAnnual / 12)}
                    </span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  {billingPeriod === "annual" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Cobrado R$ {studioDetails.priceAnnual}/ano • Economize R$ {studioDetails.price * 2}
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  {studioDetails.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {studioDetails.highlights && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg">
                    <p className="text-xs font-medium text-orange-500 mb-2">
                      Exclusivo Studio:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {studioDetails.highlights.map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Plano selecionado: <span className="text-orange-500">{selectedDetails.name}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  R$ {selectedPrice}/mês • {billingPeriod === "monthly" ? "Mensal" : "Anual"}
                  {savings > 0 && ` • Economize R$ ${savings}`}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button onClick={handleUpgrade} disabled={isLoading} size="lg">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Continuar para pagamento
                    </>
                  )}
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              🔒 Pagamento seguro via Stripe • Cancele quando quiser • Garantia de 7 dias
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Hook para usar o modal facilmente
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { showUpgradeModal, PlanUpgradeModalComponent } = usePlanUpgradeModal();
 *
 *   return (
 *     <>
 *       <button onClick={() => showUpgradeModal('pro')}>Upgrade</button>
 *       {PlanUpgradeModalComponent}
 *     </>
 *   );
 * }
 * ```
 */
export function usePlanUpgradeModal(currentPlan: PlanMode = "free") {
  const [isOpen, setIsOpen] = useState(false);
  const [recommended, setRecommended] = useState<"pro" | "studio">("pro");

  const showUpgradeModal = (recommendedPlan?: "pro" | "studio") => {
    if (recommendedPlan) {
      setRecommended(recommendedPlan);
    }
    setIsOpen(true);
  };

  const PlanUpgradeModalComponent = (
    <PlanUpgradeModal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      currentPlan={currentPlan}
      recommendedPlan={recommended}
    />
  );

  return {
    showUpgradeModal,
    PlanUpgradeModalComponent,
    isOpen,
  };
}
