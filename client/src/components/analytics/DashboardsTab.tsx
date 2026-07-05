import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Plus, LayoutDashboard, Edit, Trash2, Eye, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Dashboard {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  is_shared: boolean;
  widget_count: number;
  created_at: string;
  updated_at: string;
}

export default function DashboardsTab() {
  const [, setLocation] = useLocation();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const loadDashboards = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/analytics/dashboards", {
        credentials: "include"
      });
      const result = await response.json();

      if (result.success) {
        setDashboards(result.data);
      } else {
        toast.error("Erro ao carregar dashboards");
      }
    } catch (error) {
      console.error("Error loading dashboards:", error);
      toast.error("Erro ao carregar dashboards");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboards();
  }, []);

  const createDashboard = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/analytics/dashboards", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Novo Dashboard",
          description: "Dashboard customizável",
          isDefault: dashboards.length === 0
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Dashboard criado!");
        setLocation(`/analytics-premium/dashboard/${result.data.id}`);
      } else {
        toast.error(result.error || "Erro ao criar dashboard");
      }
    } catch (error) {
      console.error("Error creating dashboard:", error);
      toast.error("Erro ao criar dashboard");
    } finally {
      setIsCreating(false);
    }
  };

  const deleteDashboard = async (id: string, name: string) => {
    if (!window.confirm(`Deletar dashboard "${name}"?`)) return;

    try {
      const response = await fetch(`/api/analytics/dashboards/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Dashboard deletado!");
        loadDashboards();
      } else {
        toast.error(result.error || "Erro ao deletar dashboard");
      }
    } catch (error) {
      console.error("Error deleting dashboard:", error);
      toast.error("Erro ao deletar dashboard");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-frame-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Seus Dashboards</h2>
          <p className="text-sm text-frame-gray-light mt-1">
            {dashboards.length} dashboard{dashboards.length !== 1 ? 's' : ''} criado{dashboards.length !== 1 ? 's' : ''}
          </p>
        </div>

        <Button
          onClick={createDashboard}
          disabled={isCreating}
          className="frame-btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Dashboard
        </Button>
      </div>

      {/* Dashboards Grid */}
      {dashboards.length === 0 ? (
        <Card className="border-frame-gray-3 bg-frame-gray-1/20">
          <CardContent className="flex flex-col items-center justify-center min-h-64 text-center">
            <LayoutDashboard className="h-12 w-12 text-frame-gray-light mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum dashboard criado</h3>
            <p className="text-sm text-frame-gray-light mb-6 max-w-md">
              Crie seu primeiro dashboard customizável com widgets drag & drop
              para visualizar suas métricas mais importantes.
            </p>
            <Button onClick={createDashboard} disabled={isCreating}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Dashboard
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map((dashboard) => (
            <Card
              key={dashboard.id}
              className="border-frame-gray-3 bg-frame-gray-1/20 hover:border-frame-orange/40 transition-colors cursor-pointer"
              onClick={() => setLocation(`/analytics-premium/dashboard/${dashboard.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {dashboard.name}
                      {dashboard.is_default && (
                        <Star className="h-4 w-4 text-frame-orange fill-frame-orange" />
                      )}
                    </CardTitle>
                    {dashboard.description && (
                      <CardDescription className="mt-1 text-xs">
                        {dashboard.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-xs text-frame-gray-light">
                  <span>{dashboard.widget_count} widget{dashboard.widget_count !== 1 ? 's' : ''}</span>
                  <span>
                    {new Date(dashboard.updated_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(`/analytics-premium/dashboard/${dashboard.id}`);
                    }}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDashboard(dashboard.id, dashboard.name);
                    }}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
