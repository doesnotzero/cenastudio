import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import AppNavBar from "@/components/AppNavBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Plus,
  Settings,
  Save,
  ArrowLeft,
  Edit,
  Trash2,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import WidgetFactory from "@/components/analytics/WidgetFactory";
// import GridLayout from "react-grid-layout"; // Will be installed
// import "react-grid-layout/css/styles.css"; // Will be added

interface Dashboard {
  id: string;
  name: string;
  description: string | null;
  layout: any;
  is_default: boolean;
  is_shared: boolean;
  widgets: Widget[];
  created_at: string;
  updated_at: string;
}

interface Widget {
  id: string;
  dashboard_id: string;
  type: string;
  title: string;
  data_source: string;
  config: any;
  position: { x: number; y: number; w: number; h: number };
  created_at: string;
  updated_at: string;
}

function DashboardViewContent() {
  const [, params] = useRoute("/analytics-premium/dashboard/:id");
  const [, setLocation] = useLocation();
  const dashboardId = params?.id;

  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadDashboard = async () => {
    if (!dashboardId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/analytics/dashboards/${dashboardId}`, {
        credentials: "include"
      });
      const result = await response.json();

      if (result.success) {
        setDashboard(result.data);
      } else {
        toast.error("Dashboard não encontrado");
        setLocation("/analytics-premium");
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error("Erro ao carregar dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [dashboardId]);

  const saveDashboard = async () => {
    if (!dashboard) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/analytics/dashboards/${dashboard.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layout: dashboard.layout
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Dashboard salvo!");
        setIsEditMode(false);
      } else {
        toast.error(result.error || "Erro ao salvar dashboard");
      }
    } catch (error) {
      console.error("Error saving dashboard:", error);
      toast.error("Erro ao salvar dashboard");
    } finally {
      setIsSaving(false);
    }
  };

  const addWidget = () => {
    toast.info("Widget configuration modal será implementado na Task 1.6");
    // This will open WidgetConfig modal
  };

  const deleteWidget = async (widgetId: string) => {
    if (!window.confirm("Deletar este widget?")) return;

    try {
      const response = await fetch(`/api/analytics/widgets/${widgetId}`, {
        method: "DELETE",
        credentials: "include"
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Widget deletado!");
        loadDashboard();
      } else {
        toast.error(result.error || "Erro ao deletar widget");
      }
    } catch (error) {
      console.error("Error deleting widget:", error);
      toast.error("Erro ao deletar widget");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-frame-black text-frame-white font-frame-body">
        <AppNavBar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <RefreshCw className="h-8 w-8 animate-spin text-frame-orange" />
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <div className="min-h-screen bg-frame-black text-frame-white font-frame-body">
      <AppNavBar />

      <main className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 sm:py-9">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setLocation("/analytics-premium")}
                className="frame-btn-ghost"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>

              <div>
                <h1 className="text-2xl font-semibold">{dashboard.name}</h1>
                {dashboard.description && (
                  <p className="text-sm text-frame-gray-light mt-1">
                    {dashboard.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEditMode ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditMode(false)}
                    className="frame-btn-ghost"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={saveDashboard}
                    disabled={isSaving}
                    className="frame-btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Salvando..." : "Salvar"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditMode(true)}
                    className="frame-btn-ghost"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    onClick={addWidget}
                    className="frame-btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Widget
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Grid - Placeholder until react-grid-layout is installed */}
        <div className="space-y-4">
          {dashboard.widgets.length === 0 ? (
            <div className="border-2 border-dashed border-frame-gray-3 rounded-lg p-12 text-center">
              <Plus className="h-12 w-12 text-frame-gray-light mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum widget adicionado</h3>
              <p className="text-sm text-frame-gray-light mb-6 max-w-md mx-auto">
                Clique em "Adicionar Widget" para começar a personalizar seu dashboard.
              </p>
              <Button onClick={addWidget} className="frame-btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Widget
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboard.widgets.map((widget) => (
                <div key={widget.id} className="relative">
                  {isEditMode && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteWidget(widget.id)}
                      className="absolute top-2 right-2 z-10 text-red-500 hover:text-red-400 bg-frame-black/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}

                  <WidgetFactory
                    widgetId={widget.id}
                    type={widget.type}
                    title={widget.title}
                    dataSource={widget.data_source}
                    config={widget.config}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Installation Instructions */}
        <div className="mt-8 border border-frame-orange/40 bg-frame-orange/[0.06] p-4 rounded-lg">
          <p className="font-frame-mono text-xs uppercase tracking-wider text-frame-orange mb-2">
            // PRÓXIMOS PASSOS
          </p>
          <p className="text-sm text-frame-gray-light">
            <strong>Task 1.4:</strong> Este é o placeholder. Após instalar{" "}
            <code className="text-frame-orange">react-grid-layout</code>, o drag & drop será ativado.
          </p>
          <p className="text-sm text-frame-gray-light mt-2">
            <strong>Task 1.5:</strong> Componentes de widgets (KPI, Charts, Tables) serão renderizados aqui.
          </p>
          <p className="text-sm text-frame-gray-light mt-2">
            <strong>Task 1.6:</strong> Modal de configuração permitirá escolher tipo e data source.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function DashboardView() {
  return (
    <ProtectedRoute>
      <DashboardViewContent />
    </ProtectedRoute>
  );
}
