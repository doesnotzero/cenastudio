/**
 * FeatureUpgradeRequired Component
 *
 * Wrapper component that blocks access to premium features.
 * Shows upgrade prompt if user doesn't have required plan.
 *
 * @example
 * ```tsx
 * <FeatureUpgradeRequired feature="pipeline" currentPlan="free">
 *   <PipelineView />
 * </FeatureUpgradeRequired>
 * ```
 */

import React, { useState } from "react";
import { usePlanContext } from "@/contexts/PlanContext";
import { canAccessFeature } from "@/lib/feature-gating";
import type { FeatureName } from "@/types/plan";
import { PlanUpgradeModal } from "./PlanUpgradeModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Sparkles, Zap, Crown, ArrowRight } from "lucide-react";
import { getPlanDisplayName } from "@/lib/plan-config";

export interface FeatureUpgradeRequiredProps {
  /** Feature being restricted */
  feature: FeatureName;

  /** Child components to render if user has access */
  children: React.ReactNode;

  /** Custom fallback component (optional) */
  fallback?: React.ReactNode;

  /** Show feature preview/teaser (optional) */
  showPreview?: boolean;

  /** Variant of the blocked state */
  variant?: "full" | "inline" | "minimal";

  /** Custom title for blocked state */
  title?: string;

  /** Custom description for blocked state */
  description?: string;
}

/**
 * Feature metadata for display
 */
const FEATURE_METADATA: Record<FeatureName, {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  requiredPlan: "pro" | "studio";
}> = {
  "pipeline": {
    icon: <Zap className="h-8 w-8" />,
    title: "Pipeline View",
    description: "Visualize todo seu pipeline de vendas em formato Kanban",
    benefits: [
      "Arraste e solte oportunidades",
      "Filtre por status e valor",
      "Veja métricas em tempo real",
      "Integre com seu CRM",
    ],
    requiredPlan: "pro",
  },
  "video-reviews": {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Video Reviews",
    description: "Comentários frame-a-frame com timestamps precisos",
    benefits: [
      "Comentários por timestamp",
      "Anotações visuais (setas, retângulos)",
      "Compartilhe com clientes",
      "Thread de discussão",
    ],
    requiredPlan: "pro",
  },
  "collaboration": {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Colaboração em Equipe",
    description: "Trabalhe junto com sua equipe em tempo real",
    benefits: [
      "Até 5 membros (Pro) ou ilimitado (Studio)",
      "Permissões granulares",
      "Activity feed",
      "Notificações em tempo real",
    ],
    requiredPlan: "pro",
  },
  "advanced-export": {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Exportação Avançada",
    description: "Exporte seus dados em múltiplos formatos",
    benefits: [
      "PDF, Excel, CSV",
      "Templates customizáveis",
      "Bulk export",
      "Agendamento automático",
    ],
    requiredPlan: "pro",
  },
  "commercial-hub": {
    icon: <Crown className="h-8 w-8" />,
    title: "Commercial Hub",
    description: "Central completa para gestão comercial",
    benefits: [
      "Propostas comerciais IA",
      "Contratos automatizados",
      "Pipeline de vendas",
      "Métricas de conversão",
    ],
    requiredPlan: "studio",
  },
  "proposals": {
    icon: <Crown className="h-8 w-8" />,
    title: "Propostas Comerciais",
    description: "Crie propostas profissionais com IA",
    benefits: [
      "Templates personalizados",
      "Geração com IA",
      "Assinatura eletrônica",
      "Tracking de visualizações",
    ],
    requiredPlan: "studio",
  },
  "contracts": {
    icon: <Crown className="h-8 w-8" />,
    title: "Contratos Automatizados",
    description: "Gere e gerencie contratos facilmente",
    benefits: [
      "Templates jurídicos",
      "Cláusulas personalizadas",
      "Assinatura digital",
      "Histórico completo",
    ],
    requiredPlan: "studio",
  },
  "financial-module": {
    icon: <Crown className="h-8 w-8" />,
    title: "Módulo Financeiro",
    description: "Controle completo das finanças da produtora",
    benefits: [
      "Receitas e despesas",
      "Fluxo de caixa",
      "Margem por projeto",
      "Relatórios financeiros",
    ],
    requiredPlan: "studio",
  },
  "team-management": {
    icon: <Crown className="h-8 w-8" />,
    title: "Gestão de Equipe",
    description: "Gerencie membros ilimitados da equipe",
    benefits: [
      "Membros ilimitados",
      "Roles e permissões",
      "Time tracking",
      "Performance metrics",
    ],
    requiredPlan: "studio",
  },
  "analytics": {
    icon: <Crown className="h-8 w-8" />,
    title: "Analytics Avançado",
    description: "Insights profundos sobre seu negócio",
    benefits: [
      "Dashboards customizáveis",
      "Métricas de negócio",
      "Exportação de relatórios",
      "Previsões com IA",
    ],
    requiredPlan: "studio",
  },
  "api": {
    icon: <Crown className="h-8 w-8" />,
    title: "API Access",
    description: "Integre com suas ferramentas via API",
    benefits: [
      "REST API completa",
      "Webhooks",
      "Documentação completa",
      "Rate limits generosos",
    ],
    requiredPlan: "studio",
  },
  "custom-branding": {
    icon: <Crown className="h-8 w-8" />,
    title: "Custom Branding",
    description: "White-label completo com sua marca",
    benefits: [
      "Logo personalizado",
      "Cores da marca",
      "Domínio próprio",
      "Email personalizado",
    ],
    requiredPlan: "studio",
  },
  "priority-support": {
    icon: <Crown className="h-8 w-8" />,
    title: "Suporte Prioritário",
    description: "Atendimento rápido quando você precisa",
    benefits: [
      "Resposta em < 2h",
      "Chat direto",
      "Call 1-on-1",
      "Account manager dedicado",
    ],
    requiredPlan: "studio",
  },
  // Fallback for non-premium features
  "projects": {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Projetos",
    description: "Gerencie seus projetos audiovisuais",
    benefits: [],
    requiredPlan: "pro",
  },
  "clients": {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Clientes",
    description: "Gerencie seus clientes",
    benefits: [],
    requiredPlan: "pro",
  },
  "tools": {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Ferramentas IA",
    description: "12 ferramentas IA para produção",
    benefits: [],
    requiredPlan: "pro",
  },
};

/**
 * FeatureUpgradeRequired Component
 */
export function FeatureUpgradeRequired({
  feature,
  children,
  fallback,
  showPreview = false,
  variant = "full",
  title,
  description,
}: FeatureUpgradeRequiredProps) {
  const { planMode } = usePlanContext();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Check if user has access
  const accessResult = canAccessFeature(feature, planMode);

  // User has access - render children
  if (accessResult.hasAccess) {
    return <>{children}</>;
  }

  // Custom fallback provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Get feature metadata
  const metadata = FEATURE_METADATA[feature] || FEATURE_METADATA["projects"];
  const displayTitle = title || metadata.title;
  const displayDescription = description || metadata.description;
  const requiredPlanName = getPlanDisplayName(accessResult.requiredPlan || "pro");

  // Minimal variant
  if (variant === "minimal") {
    return (
      <>
        <div className="flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">{displayTitle}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Requer plano {requiredPlanName}
              </p>
            </div>
            <Button onClick={() => setShowUpgradeModal(true)}>
              Fazer Upgrade
            </Button>
          </div>
        </div>

        <PlanUpgradeModal
          open={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentPlan={planMode}
          triggerFeature={displayTitle}
          recommendedPlan={metadata.requiredPlan}
        />
      </>
    );
  }

  // Inline variant
  if (variant === "inline") {
    return (
      <>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 text-orange-500">
                {metadata.icon}
              </div>
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  {displayTitle}
                  <Badge variant="outline">{requiredPlanName}</Badge>
                </CardTitle>
                <CardDescription>{displayDescription}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setShowUpgradeModal(true)} className="w-full">
              Fazer Upgrade <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <PlanUpgradeModal
          open={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentPlan={planMode}
          triggerFeature={displayTitle}
          recommendedPlan={metadata.requiredPlan}
        />
      </>
    );
  }

  // Full variant (default)
  return (
    <>
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-yellow-500/20">
              <div className="text-orange-500">
                {metadata.icon}
              </div>
            </div>
            <CardTitle className="text-2xl">{displayTitle}</CardTitle>
            <CardDescription className="text-base mt-2">
              {displayDescription}
            </CardDescription>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge variant="outline">Disponível no plano {requiredPlanName}</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Benefits */}
            {metadata.benefits.length > 0 && (
              <div>
                <p className="font-medium mb-3">O que você ganha:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {metadata.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-0.5 text-green-500">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview */}
            {showPreview && (
              <div className="rounded-lg border-2 border-dashed border-muted p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Preview da feature seria exibido aqui
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={() => setShowUpgradeModal(true)}
                size="lg"
                className="w-full"
              >
                Fazer Upgrade para {requiredPlanName}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Cancele quando quiser • Garantia de 7 dias
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <PlanUpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={planMode}
        triggerFeature={displayTitle}
        recommendedPlan={metadata.requiredPlan}
      />
    </>
  );
}
