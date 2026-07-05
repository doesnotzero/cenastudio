import { useState } from "react";
import { Link, useLocation } from "wouter";
import AppNavBar from "@/components/AppNavBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BarChart3, LayoutDashboard, FileText, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardsTab from "@/components/analytics/DashboardsTab";
import ReportsTab from "@/components/analytics/ReportsTab";

function AnalyticsPremiumContent() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboards");

  return (
    <div className="min-h-screen bg-frame-black text-frame-white font-frame-body">
      <AppNavBar />

      <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 sm:py-9">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="frame-label mb-2">// ANALYTICS PREMIUM</p>
              <h1 className="frame-title text-[clamp(2.3rem,4.4vw,4.2rem)]">
                Dashboards Customizáveis
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-frame-gray-light">
                Crie dashboards personalizados com widgets drag & drop, gere relatórios avançados
                e exporte em múltiplos formatos.
              </p>
            </div>

            <Link href="/analytics" className="frame-btn-ghost">
              ← Voltar para Finance
            </Link>
          </div>
        </header>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="dashboards" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboards
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboards" className="mt-6">
            <DashboardsTab />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <ReportsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function AnalyticsPremium() {
  return (
    <ProtectedRoute>
      <AnalyticsPremiumContent />
    </ProtectedRoute>
  );
}
