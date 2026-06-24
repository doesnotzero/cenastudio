import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import AppNavBar from "@/components/AppNavBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import AnimatedModal from "@/components/AnimatedModal";
import {
  Plus,
  DollarSign,
  TrendingUp,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Building2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface Opportunity {
  id: number;
  clientId: number | null;
  client_name?: string;
  client_company?: string;
  title: string;
  stage: string;
  estimated_value: number | null;
  probability: number;
  expected_close_date: string | null;
  lost_reason: string | null;
  created_at: string;
  updated_at: string;
}

interface PipelineStats {
  totalOpportunities: number;
  totalPipelineValue: number;
  byStage: Array<{ stage: string; count: number; value: number }>;
  wonThisMonth: { count: number; value: number };
}

const STAGES = [
  { id: "prospect", label: "Prospecção", color: "border-blue-500/30" },
  { id: "meeting", label: "Reunião", color: "border-yellow-500/30" },
  { id: "proposal", label: "Proposta", color: "border-purple-500/30" },
  { id: "negotiation", label: "Negociação", color: "border-orange-500/30" },
  { id: "won", label: "Fechado", color: "border-green-500/30" },
  { id: "lost", label: "Perdido", color: "border-red-500/30" },
];

function PipelineContent() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [stage, setStage] = useState("prospect");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [probability, setProbability] = useState("50");
  const [expectedCloseDate, setExpectedCloseDate] = useState("");
  const [lostReason, setLostReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    loadOpportunities();
    loadStats();
    loadClients();
  }, []);

  const loadOpportunities = async () => {
    try {
      const response = await fetch("/api/clients/opportunities");
      const data = await response.json();
      if (data.success) {
        setOpportunities(data.data);
      }
    } catch (error) {
      console.error("Error loading opportunities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("/api/clients/opportunities/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadClients = async () => {
    try {
      const response = await fetch("/api/clients");
      const data = await response.json();
      if (data.success) {
        setClients(data.data);
      }
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/clients/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          clientId: clientId ? parseInt(clientId) : undefined,
          stage,
          estimatedValue: estimatedValue ? parseInt(estimatedValue) : undefined,
          probability: parseInt(probability),
          expectedCloseDate: expectedCloseDate || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Oportunidade criada com sucesso!");
        setIsCreateOpen(false);
        resetForm();
        loadOpportunities();
        loadStats();
      } else {
        toast.error(data.error || "Erro ao criar oportunidade");
      }
    } catch (error) {
      toast.error("Erro ao criar oportunidade");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpportunity || !title.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/clients/opportunities/${selectedOpportunity.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          stage,
          estimatedValue: estimatedValue ? parseInt(estimatedValue) : undefined,
          probability: parseInt(probability),
          expectedCloseDate: expectedCloseDate || undefined,
          lostReason: stage === "lost" ? lostReason : undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Oportunidade atualizada com sucesso!");
        setIsEditOpen(false);
        resetForm();
        loadOpportunities();
        loadStats();
      } else {
        toast.error(data.error || "Erro ao atualizar oportunidade");
      }
    } catch (error) {
      toast.error("Erro ao atualizar oportunidade");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedOpportunity) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/clients/opportunities/${selectedOpportunity.id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Oportunidade excluída com sucesso!");
        setIsDeleteOpen(false);
        setSelectedOpportunity(null);
        loadOpportunities();
        loadStats();
      } else {
        toast.error(data.error || "Erro ao excluir oportunidade");
      }
    } catch (error) {
      toast.error("Erro ao excluir oportunidade");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveStage = async (opportunity: Opportunity, newStage: string) => {
    try {
      const response = await fetch(`/api/clients/opportunities/${opportunity.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Estágio atualizado!");
        loadOpportunities();
        loadStats();
      } else {
        toast.error(data.error || "Erro ao atualizar estágio");
      }
    } catch (error) {
      toast.error("Erro ao atualizar estágio");
    }
  };

  const openEditModal = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setTitle(opportunity.title);
    setClientId(opportunity.clientId?.toString() || "");
    setStage(opportunity.stage);
    setEstimatedValue(opportunity.estimated_value?.toString() || "");
    setProbability(opportunity.probability.toString());
    setExpectedCloseDate(opportunity.expected_close_date || "");
    setLostReason(opportunity.lost_reason || "");
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setTitle("");
    setClientId("");
    setStage("prospect");
    setEstimatedValue("");
    setProbability("50");
    setExpectedCloseDate("");
    setLostReason("");
    setSelectedOpportunity(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getOpportunitiesByStage = (stageId: string) => {
    return opportunities.filter((opp) => opp.stage === stageId);
  };

  const getStageTotal = (stageId: string) => {
    return getOpportunitiesByStage(stageId).reduce((sum, opp) => sum + (opp.estimated_value || 0), 0);
  };

  return (
    <div className="min-h-screen bg-frame-black text-frame-white font-frame-body flex flex-col">
      <AppNavBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="frame-label mb-2">// VENDAS</p>
            <h1 className="frame-title text-[clamp(2.1rem,4vw,3.5rem)]">
              PIPELINE
            </h1>
            <p className="text-frame-gray-light text-sm mt-2">
              Gerencie seu pipeline de oportunidades de vendas
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setIsCreateOpen(true);
            }}
            className="frame-btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Oportunidade
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-frame-gray-3 bg-frame-gray-1/30 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-frame-orange/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-frame-orange" />
                </div>
                <div>
                  <p className="text-[0.65rem] text-frame-gray-light font-frame-mono uppercase tracking-wider">
                    Total Pipeline
                  </p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalPipelineValue)}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border border-frame-gray-3 bg-frame-gray-1/30 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-[0.65rem] text-frame-gray-light font-frame-mono uppercase tracking-wider">
                    Oportunidades
                  </p>
                  <p className="text-2xl font-bold">{stats.totalOpportunities}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-frame-gray-3 bg-frame-gray-1/30 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-[0.65rem] text-frame-gray-light font-frame-mono uppercase tracking-wider">
                    Fechados (Mês)
                  </p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.wonThisMonth.value)}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Kanban Board */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-frame-orange" />
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STAGES.map((stage) => {
              const stageOpps = getOpportunitiesByStage(stage.id);
              const stageTotal = getStageTotal(stage.id);

              return (
                <div
                  key={stage.id}
                  className={`flex-shrink-0 w-80 border ${stage.color} bg-frame-gray-1/10 rounded-none`}
                >
                  <div className="p-4 border-b border-frame-gray-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-frame-mono text-sm font-semibold">{stage.label}</h3>
                      <span className="text-xs text-frame-gray-light">{stageOpps.length}</span>
                    </div>
                    <p className="text-sm font-bold text-frame-orange">{formatCurrency(stageTotal)}</p>
                  </div>

                  <div className="p-3 space-y-3 min-h-[200px]">
                    {stageOpps.map((opp) => (
                      <motion.div
                        key={opp.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-frame-gray-2 border border-frame-gray-3 p-3 hover:border-frame-orange/50 transition cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-semibold text-frame-white line-clamp-2">
                            {opp.title}
                          </h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 hover:bg-frame-gray-3 transition rounded-none opacity-0 group-hover:opacity-100">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-frame-black border-frame-gray-3">
                              <DropdownMenuItem
                                onClick={() => openEditModal(opp)}
                                className="cursor-pointer"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedOpportunity(opp);
                                  setIsDeleteOpen(true);
                                }}
                                className="cursor-pointer text-frame-red"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {opp.client_name && (
                          <div className="flex items-center gap-1 text-xs text-frame-gray-light mb-2">
                            <Building2 className="w-3 h-3" />
                            <span className="truncate">{opp.client_name}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-frame-orange font-semibold">
                            {opp.estimated_value ? formatCurrency(opp.estimated_value) : "N/A"}
                          </span>
                          <span className="text-frame-gray-light">{opp.probability}%</span>
                        </div>

                        {opp.expected_close_date && (
                          <div className="flex items-center gap-1 text-xs text-frame-gray-light mt-2">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(opp.expected_close_date)}</span>
                          </div>
                        )}

                        {/* Stage Navigation */}
                        <div className="flex gap-1 mt-3 pt-3 border-t border-frame-gray-3">
                          {STAGES.map((s) => {
                            const currentIndex = STAGES.findIndex((st) => st.id === stage.id);
                            const targetIndex = STAGES.findIndex((st) => st.id === s.id);
                            const canMove = Math.abs(targetIndex - currentIndex) === 1;

                            if (!canMove || s.id === stage.id) return null;

                            return (
                              <button
                                key={s.id}
                                onClick={() => handleMoveStage(opp, s.id)}
                                className="flex-1 p-1.5 text-xs bg-frame-gray-3 hover:bg-frame-orange/20 hover:text-frame-orange transition rounded-none"
                                title={s.label}
                              >
                                <ArrowRight className="w-3 h-3 mx-auto" />
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    ))}

                    {stageOpps.length === 0 && (
                      <div className="text-center py-8 text-frame-gray-light text-sm">
                        Nenhuma oportunidade
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Modal */}
      <AnimatedModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="NOVA OPORTUNIDADE"
        description="Adicione uma nova oportunidade ao pipeline"
        footer={
          <>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsCreateOpen(false)}
              className="frame-btn-ghost"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="create-opportunity-form"
              disabled={isSubmitting || !title.trim()}
              className="frame-btn-primary"
            >
              {isSubmitting ? "Criando..." : "Criar Oportunidade"}
            </button>
          </>
        }
      >
        <form id="create-opportunity-form" onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                Título *
              </label>
              <input
                type="text"
                required
                disabled={isSubmitting}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                placeholder="Nome do projeto/operação"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                Cliente
              </label>
              <select
                disabled={isSubmitting}
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
              >
                <option value="">Nenhum cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.company ? `${client.name} (${client.company})` : client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                  Valor Estimado
                </label>
                <input
                  type="number"
                  disabled={isSubmitting}
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                  Probabilidade %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  disabled={isSubmitting}
                  value={probability}
                  onChange={(e) => setProbability(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                  placeholder="50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                  Estágio
                </label>
                <select
                  disabled={isSubmitting}
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                  Data Fechamento
                </label>
                <input
                  type="date"
                  disabled={isSubmitting}
                  value={expectedCloseDate}
                  onChange={(e) => setExpectedCloseDate(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                />
              </div>
            </div>

        </form>
      </AnimatedModal>

      {/* Edit Modal */}
      <AnimatedModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="EDITAR OPORTUNIDADE"
        description="Atualize os detalhes da oportunidade"
        footer={
          <>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsEditOpen(false)}
              className="frame-btn-ghost"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="edit-opportunity-form"
              disabled={isSubmitting || !title.trim()}
              className="frame-btn-primary"
            >
              {isSubmitting ? "Atualizando..." : "Atualizar Oportunidade"}
            </button>
          </>
        }
      >
        <form id="edit-opportunity-form" onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                Título *
              </label>
              <input
                type="text"
                required
                disabled={isSubmitting}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                  Valor Estimado
                </label>
                <input
                  type="number"
                  disabled={isSubmitting}
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                  Probabilidade %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  disabled={isSubmitting}
                  value={probability}
                  onChange={(e) => setProbability(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                  Estágio
                </label>
                <select
                  disabled={isSubmitting}
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                  Data Fechamento
                </label>
                <input
                  type="date"
                  disabled={isSubmitting}
                  value={expectedCloseDate}
                  onChange={(e) => setExpectedCloseDate(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                />
              </div>
            </div>

            {stage === "lost" && (
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-red uppercase">
                  Motivo da Perda
                </label>
                <textarea
                  disabled={isSubmitting}
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-red/30 px-3 py-2 text-sm outline-none focus:border-frame-red rounded-none resize-none h-20"
                  placeholder="Descreva o motivo..."
                />
              </div>
            )}

        </form>
      </AnimatedModal>

      {/* Delete Modal */}
      <AnimatedModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="EXCLUIR OPORTUNIDADE?"
        description="Esta ação é permanente."
        footer={
          <>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsDeleteOpen(false)}
              className="frame-btn-ghost"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleDelete}
              className="bg-frame-red hover:bg-red-600 text-white px-4 py-2 text-sm font-frame-mono uppercase tracking-wider transition rounded-none"
            >
              {isSubmitting ? "Excluindo..." : "Excluir"}
            </button>
          </>
        }
      >
        <div className="flex items-center gap-4 mt-4 p-4 border border-frame-red/30 bg-frame-red/5">
          <Trash2 className="w-5 h-5 text-frame-red" />
          <div>
            <p className="font-semibold text-frame-white">{selectedOpportunity?.title}</p>
            {selectedOpportunity?.client_name && (
              <p className="text-sm text-frame-gray-light">{selectedOpportunity.client_name}</p>
            )}
          </div>
        </div>
      </AnimatedModal>
    </div>
  );
}

export default function Pipeline() {
  return (
    <ProtectedRoute>
      <PipelineContent />
    </ProtectedRoute>
  );
}
