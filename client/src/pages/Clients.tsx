import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import AppNavBar from "@/components/AppNavBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import AnimatedModal from "@/components/AnimatedModal";
import {
  Users, Plus, Search, Phone, Mail, Building2, MoreVertical,
  Edit, Trash2, TrendingUp, DollarSign, GripVertical, X,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Client {
  id: number;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  segment: string;
  status: string;
  workflow_stage?: string;
  notes?: string;
  total_spent: number;
  created_at: string;
  updated_at: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  industry?: string;
  company_size?: string;
  annual_revenue?: number;
  contact_person?: string;
  contact_role?: string;
  billing_cycle?: string;
  payment_method?: string;
  tax_id?: string;
}

const WORKFLOW_STAGES = [
  { id: "prospect", label: "Prospectado", color: "border-blue-500/30 bg-blue-500/5" },
  { id: "contacted", label: "Contatado", color: "border-yellow-500/30 bg-yellow-500/5" },
  { id: "qualified", label: "Qualificado", color: "border-purple-500/30 bg-purple-500/5" },
  { id: "proposal", label: "Proposta", color: "border-orange-500/30 bg-orange-500/5" },
  { id: "negotiation", label: "Negociação", color: "border-pink-500/30 bg-pink-500/5" },
  { id: "won", label: "Ganho", color: "border-green-500/30 bg-green-500/5" },
  { id: "recurrent", label: "Recorrente", color: "border-cyan-500/30 bg-cyan-500/5" },
  { id: "freela", label: "Freela", color: "border-indigo-500/30 bg-indigo-500/5" },
  { id: "lost", label: "Perdido", color: "border-red-500/30 bg-red-500/5" },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function SortableClientCard({
  client,
  onEdit,
  onDelete,
  isDragging,
}: {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: `client-${client.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const stage = WORKFLOW_STAGES.find((s) => s.id === client.workflow_stage) || WORKFLOW_STAGES[0];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`border-l-2 ${stage.color} bg-frame-gray-2/30 p-3 mb-2 cursor-grab active:cursor-grabbing hover:border-l-frame-orange transition-all group`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-frame-white truncate">{client.name}</h4>
          {client.company && (
            <p className="text-xs text-frame-gray-light truncate">{client.company}</p>
          )}
        </div>
        <div {...listeners} className="cursor-grab shrink-0 opacity-0 group-hover:opacity-100 transition">
          <GripVertical className="w-3.5 h-3.5 text-frame-gray-light" />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 text-xs text-frame-gray-light">
        {client.email && <Mail className="w-3 h-3 shrink-0" />}
        {client.phone && <Phone className="w-3 h-3 shrink-0" />}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-frame-gray-3">
        <span className="text-xs text-frame-gray-light font-mono">{formatCurrency(client.total_spent)}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-frame-gray-3 rounded transition-colors opacity-0 group-hover:opacity-100">
              <MoreVertical className="w-3.5 h-3.5 text-frame-gray-light" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(client)}>
              <Edit className="w-4 h-4 mr-2" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(client)} className="text-red-400">
              <Trash2 className="w-4 h-4 mr-2" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function ColumnHeader({ stage, count }: { stage: typeof WORKFLOW_STAGES[0]; count: number }) {
  const stageColors: Record<string, string> = {
    prospect: "bg-blue-500",
    contacted: "bg-yellow-500",
    qualified: "bg-purple-500",
    proposal: "bg-orange-500",
    negotiation: "bg-pink-500",
    won: "bg-green-500",
    recurrent: "bg-cyan-500",
    freela: "bg-indigo-500",
    lost: "bg-red-500",
  };

  return (
    <div className={`flex items-center justify-between px-3 py-2.5 border-b ${stage.color} bg-frame-gray-1`}>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${stageColors[stage.id] || "bg-frame-gray-4"}`} />
        <h3 className="font-semibold text-xs text-frame-white uppercase tracking-wider">{stage.label}</h3>
      </div>
      <span className="text-xs font-mono text-frame-gray-light bg-frame-gray-2 px-2 py-0.5">{count}</span>
    </div>
  );
}

interface ClientStats {
  totalClients: number;
  activeClients: number;
  leadClients: number;
  totalRevenue: number;
  bySegment: Array<{ segment: string; count: number }>;
  recentActivity: any[];
}

function ClientsContent() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [segment, setSegment] = useState("direct");
  const [status, setStatus] = useState("lead");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [annualRevenue, setAnnualRevenue] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [billingCycle, setBillingCycle] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [taxId, setTaxId] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSegment, setFilterSegment] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const loadClients = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      if (filterSegment) params.append("segment", filterSegment);
      if (searchTerm) params.append("search", searchTerm);
      const response = await fetch(`/api/clients?${params}`);
      const data = await response.json();
      if (data.success) setClients(data.data);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, filterSegment, searchTerm]);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/clients/stats");
      const data = await response.json();
      if (data.success) setStats(data.data);
    } catch {
      console.error("Error loading stats");
    }
  };

  useEffect(() => {
    loadClients();
    loadStats();
  }, []);

  useEffect(() => {
    loadClients();
  }, [filterStatus, filterSegment]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const clientId = parseInt(String(active.id).replace("client-", ""));
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    const overId = String(over.id);
    let targetStage: string | null = null;

    // Check if dropped on a stage column header
    const stageMatch = WORKFLOW_STAGES.find((s) => s.id === overId);
    if (stageMatch) {
      targetStage = stageMatch.id;
    }

    // Check if dropped on another client card -> infer stage from that client
    if (!targetStage && overId.startsWith("client-")) {
      const overClientId = parseInt(overId.replace("client-", ""));
      const overClient = clients.find((c) => c.id === overClientId);
      if (overClient) {
        targetStage = overClient.workflow_stage || "prospect";
      }
    }

    if (targetStage && targetStage !== client.workflow_stage) {
      try {
        const response = await fetch(`/api/clients/${client.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workflow_stage: targetStage }),
        });
        if (response.ok) {
          const stageLabel = WORKFLOW_STAGES.find((s) => s.id === targetStage)?.label || targetStage;
          toast.success(`${client.name} movido para ${stageLabel}`);
          loadClients();
        }
      } catch {
        toast.error("Erro ao mover cliente");
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), company: company.trim() || undefined,
          email: email.trim() || undefined, phone: phone.trim() || undefined,
          segment, status, notes: notes.trim() || undefined,
          address: address.trim() || undefined, city: city.trim() || undefined,
          state: state.trim() || undefined, country: country.trim() || undefined,
          website: website.trim() || undefined, linkedin: linkedin.trim() || undefined,
          instagram: instagram.trim() || undefined, industry: industry.trim() || undefined,
          company_size: companySize.trim() || undefined,
          annual_revenue: annualRevenue ? parseInt(annualRevenue) : undefined,
          contact_person: contactPerson.trim() || undefined,
          contact_role: contactRole.trim() || undefined,
          billing_cycle: billingCycle.trim() || undefined,
          payment_method: paymentMethod.trim() || undefined,
          tax_id: taxId.trim() || undefined,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Cliente criado com sucesso!");
        setIsCreateOpen(false);
        resetForm();
        loadClients();
        loadStats();
      } else {
        toast.error(data.error || "Erro ao criar cliente");
      }
    } catch {
      toast.error("Erro ao criar cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !name.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), company: company.trim() || undefined,
          email: email.trim() || undefined, phone: phone.trim() || undefined,
          segment, status, notes: notes.trim() || undefined,
          address: address.trim() || undefined, city: city.trim() || undefined,
          state: state.trim() || undefined, country: country.trim() || undefined,
          website: website.trim() || undefined, linkedin: linkedin.trim() || undefined,
          instagram: instagram.trim() || undefined, industry: industry.trim() || undefined,
          company_size: companySize.trim() || undefined,
          annual_revenue: annualRevenue ? parseInt(annualRevenue) : undefined,
          contact_person: contactPerson.trim() || undefined,
          contact_role: contactRole.trim() || undefined,
          billing_cycle: billingCycle.trim() || undefined,
          payment_method: paymentMethod.trim() || undefined,
          tax_id: taxId.trim() || undefined,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Cliente atualizado com sucesso!");
        setIsEditOpen(false);
        resetForm();
        loadClients();
        loadStats();
      } else {
        toast.error(data.error || "Erro ao atualizar cliente");
      }
    } catch {
      toast.error("Erro ao atualizar cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClient) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/clients/${selectedClient.id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        toast.success("Cliente excluído com sucesso!");
        setIsDeleteOpen(false);
        setSelectedClient(null);
        loadClients();
        loadStats();
      } else {
        toast.error(data.error || "Erro ao excluir cliente");
      }
    } catch {
      toast.error("Erro ao excluir cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    setName(client.name);
    setCompany(client.company || "");
    setEmail(client.email || "");
    setPhone(client.phone || "");
    setSegment(client.segment);
    setStatus(client.status);
    setNotes(client.notes || "");
    setAddress(client.address || "");
    setCity(client.city || "");
    setState(client.state || "");
    setCountry(client.country || "");
    setWebsite(client.website || "");
    setLinkedin(client.linkedin || "");
    setInstagram(client.instagram || "");
    setIndustry(client.industry || "");
    setCompanySize(client.company_size || "");
    setAnnualRevenue(client.annual_revenue?.toString() || "");
    setContactPerson(client.contact_person || "");
    setContactRole(client.contact_role || "");
    setBillingCycle(client.billing_cycle || "");
    setPaymentMethod(client.payment_method || "");
    setTaxId(client.tax_id || "");
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setName(""); setCompany(""); setEmail(""); setPhone("");
    setSegment("direct"); setStatus("lead"); setNotes("");
    setAddress(""); setCity(""); setState(""); setCountry("");
    setWebsite(""); setLinkedin(""); setInstagram("");
    setIndustry(""); setCompanySize(""); setAnnualRevenue("");
    setContactPerson(""); setContactRole("");
    setBillingCycle(""); setPaymentMethod(""); setTaxId("");
    setSelectedClient(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "lead": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "inactive": return "text-gray-400 bg-gray-400/10 border-gray-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Ativo";
      case "lead": return "Lead";
      case "inactive": return "Inativo";
      default: return status;
    }
  };

  const activeDragClient = activeDragId
    ? clients.find((c) => `client-${c.id}` === activeDragId)
    : null;

  return (
    <div className="min-h-screen bg-frame-black text-frame-white font-frame-body flex flex-col">
      <AppNavBar />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-frame-orange font-frame-mono text-xs tracking-[0.2em] uppercase mb-2">// CRM</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">CLIENTES</h1>
            <p className="text-frame-gray-light text-sm mt-2">Gerencie seu portfólio de clientes e oportunidades</p>
          </div>
          <button
            onClick={() => { resetForm(); setIsCreateOpen(true); }}
            className="frame-btn-primary flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Novo Cliente
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total", value: stats.totalClients, icon: Users, color: "text-frame-orange bg-frame-orange/10" },
              { label: "Ativos", value: stats.activeClients, icon: TrendingUp, color: "text-green-400 bg-green-500/10" },
              { label: "Leads", value: stats.leadClients, icon: Users, color: "text-blue-400 bg-blue-500/10" },
              { label: "Receita", value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: "text-green-400 bg-green-500/10" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border border-frame-gray-3 bg-frame-gray-1/20 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.6rem] text-frame-gray-light font-frame-mono uppercase tracking-wider">{item.label}</p>
                    <p className="text-xl font-bold truncate">{item.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-frame-gray-light" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-frame-gray-2 border border-frame-gray-3 pl-10 pr-4 py-2 text-sm outline-none focus:border-frame-orange"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-frame-gray-2 border border-frame-gray-3 px-4 py-2 text-sm outline-none focus:border-frame-orange"
          >
            <option value="">Todos Status</option>
            <option value="active">Ativo</option>
            <option value="lead">Lead</option>
            <option value="inactive">Inativo</option>
          </select>
          <select
            value={filterSegment}
            onChange={(e) => setFilterSegment(e.target.value)}
            className="bg-frame-gray-2 border border-frame-gray-3 px-4 py-2 text-sm outline-none focus:border-frame-orange"
          >
            <option value="">Todos Segmentos</option>
            <option value="direct">Direto</option>
            <option value="agency">Agência</option>
            <option value="brand">Marca</option>
          </select>
        </div>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin" style={{ minHeight: "500px" }}>
            {WORKFLOW_STAGES.map((stage) => {
              const stageClients = clients.filter((c) => c.workflow_stage === stage.id);
              return (
                <div
                  key={stage.id}
                  className={`flex-shrink-0 w-[260px] border ${stage.color} bg-frame-black/50 flex flex-col`}
                  style={{ maxHeight: "calc(100vh - 320px)" }}
                >
                  <ColumnHeader stage={stage} count={stageClients.length} />
                  <SortableContext
                    items={stageClients.map((c) => `client-${c.id}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex-1 overflow-y-auto p-2 space-y-0">
                      <AnimatePresence>
                        {stageClients.map((client) => (
                          <motion.div
                            key={client.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                          >
                            <SortableClientCard
                              client={client}
                              onEdit={openEditModal}
                              onDelete={(c) => { setSelectedClient(c); setIsDeleteOpen(true); }}
                              isDragging={activeDragId === `client-${client.id}`}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </SortableContext>
                </div>
              );
            })}
          </div>

          <DragOverlay>
            {activeDragClient ? (
              <div className="w-[260px] border-l-2 border-frame-orange bg-frame-gray-2/80 p-3 shadow-2xl">
                <h4 className="font-semibold text-sm text-frame-white">{activeDragClient.name}</h4>
                {activeDragClient.company && (
                  <p className="text-xs text-frame-gray-light">{activeDragClient.company}</p>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Empty State */}
        {!isLoading && clients.length === 0 && (
          <div className="border border-dashed border-frame-gray-3 p-12 text-center">
            <Users className="w-12 h-12 text-frame-gray-light mx-auto mb-4" />
            <p className="text-frame-gray-light mb-4">Nenhum cliente encontrado</p>
            <button
              onClick={() => { resetForm(); setIsCreateOpen(true); }}
              className="frame-btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Cliente
            </button>
          </div>
        )}
      </main>

      {/* Create Modal */}
      <AnimatedModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="NOVO CLIENTE"
        description="Adicione um novo cliente ao seu CRM"
        footer={
          <div className="flex gap-3 w-full">
            <button type="button" onClick={() => setIsCreateOpen(false)} disabled={isSubmitting} className="frame-btn-ghost flex-1">
              Cancelar
            </button>
            <button type="submit" form="create-client-form" disabled={isSubmitting} className="frame-btn-primary flex-1">
              {isSubmitting ? "Criando..." : "Criar Cliente"}
            </button>
          </div>
        }
      >
        <form id="create-client-form" onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <label className="block font-frame-mono text-xs text-frame-orange uppercase">Nome *</label>
            <input type="text" required disabled={isSubmitting} value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" placeholder="Nome do cliente" />
          </div>
          <div className="space-y-2">
            <label className="block font-frame-mono text-xs text-frame-orange uppercase">Empresa</label>
            <input type="text" disabled={isSubmitting} value={company} onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" placeholder="Nome da empresa" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-orange uppercase">Email</label>
              <input type="email" disabled={isSubmitting} value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" placeholder="email@exemplo.com" />
            </div>
            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-orange uppercase">Telefone</label>
              <input type="text" disabled={isSubmitting} value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" placeholder="+55 11 99999-9999" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-orange uppercase">Segmento</label>
              <select disabled={isSubmitting} value={segment} onChange={(e) => setSegment(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange">
                <option value="direct">Direto</option>
                <option value="agency">Agência</option>
                <option value="brand">Marca</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-orange uppercase">Status</label>
              <select disabled={isSubmitting} value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange">
                <option value="lead">Lead</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-frame-gray-3">
            <h4 className="font-frame-mono text-xs text-frame-orange uppercase">Endereço</h4>
            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Endereço</label>
              <input type="text" disabled={isSubmitting} value={address} onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" placeholder="Rua, número, complemento" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Cidade</label>
                <input type="text" disabled={isSubmitting} value={city} onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
              </div>
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Estado</label>
                <input type="text" disabled={isSubmitting} value={state} onChange={(e) => setState(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
              </div>
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-gray-light uppercase">País</label>
                <input type="text" disabled={isSubmitting} value={country} onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-frame-gray-3">
            <h4 className="font-frame-mono text-xs text-frame-orange uppercase">Redes Sociais</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Website</label>
                <input type="url" disabled={isSubmitting} value={website} onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" placeholder="https://" />
              </div>
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-gray-light uppercase">LinkedIn</label>
                <input type="url" disabled={isSubmitting} value={linkedin} onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" placeholder="https://linkedin.com/" />
              </div>
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Instagram</label>
                <input type="url" disabled={isSubmitting} value={instagram} onChange={(e) => setInstagram(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" placeholder="https://instagram.com/" />
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-frame-gray-3">
            <h4 className="font-frame-mono text-xs text-frame-orange uppercase">Informações da Empresa</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Indústria</label>
                <input type="text" disabled={isSubmitting} value={industry} onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" placeholder="Ex: Produção de Vídeo" />
              </div>
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Tamanho</label>
                <select disabled={isSubmitting} value={companySize} onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange">
                  <option value="">Selecione</option>
                  <option value="1-10">1-10 funcionários</option>
                  <option value="11-50">11-50 funcionários</option>
                  <option value="51-200">51-200 funcionários</option>
                  <option value="201-500">201-500 funcionários</option>
                  <option value="500+">500+ funcionários</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Receita Anual (R$)</label>
                <input type="number" disabled={isSubmitting} value={annualRevenue} onChange={(e) => setAnnualRevenue(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" placeholder="0.00" />
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-frame-gray-3">
            <h4 className="font-frame-mono text-xs text-frame-orange uppercase">Contato Principal</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Pessoa de Contato</label>
                <input type="text" disabled={isSubmitting} value={contactPerson} onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
              </div>
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Cargo</label>
                <input type="text" disabled={isSubmitting} value={contactRole} onChange={(e) => setContactRole(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" placeholder="Ex: Diretor de Marketing" />
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-frame-gray-3">
            <h4 className="font-frame-mono text-xs text-frame-orange uppercase">Financeiro</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Ciclo de Cobrança</label>
                <select disabled={isSubmitting} value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange">
                  <option value="">Selecione</option>
                  <option value="monthly">Mensal</option>
                  <option value="quarterly">Trimestral</option>
                  <option value="annual">Anual</option>
                  <option value="project">Por Projeto</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Método de Pagamento</label>
                <select disabled={isSubmitting} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange">
                  <option value="">Selecione</option>
                  <option value="pix">PIX</option>
                  <option value="bank_transfer">Transferência</option>
                  <option value="credit_card">Cartão</option>
                  <option value="boleto">Boleto</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-gray-light uppercase">CNPJ/CPF</label>
                <input type="text" disabled={isSubmitting} value={taxId} onChange={(e) => setTaxId(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" placeholder="00.000.000/0000-00" />
              </div>
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t border-frame-gray-3">
            <label className="block font-frame-mono text-xs text-frame-orange uppercase">Notas</label>
            <textarea disabled={isSubmitting} value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange resize-none" rows={3} placeholder="Observações sobre o cliente..." />
          </div>
        </form>
      </AnimatedModal>

      {/* Edit Modal */}
      <AnimatedModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="EDITAR CLIENTE"
        description="Atualize as informações do cliente"
        footer={
          <div className="flex gap-3 w-full">
            <button type="button" onClick={() => setIsEditOpen(false)} disabled={isSubmitting} className="frame-btn-ghost flex-1">
              Cancelar
            </button>
            <button type="submit" form="edit-client-form" disabled={isSubmitting} className="frame-btn-primary flex-1">
              {isSubmitting ? "Atualizando..." : "Atualizar"}
            </button>
          </div>
        }
      >
        <form id="edit-client-form" onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <label className="block font-frame-mono text-xs text-frame-orange uppercase">Nome *</label>
            <input type="text" required disabled={isSubmitting} value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
          </div>
          <div className="space-y-2">
            <label className="block font-frame-mono text-xs text-frame-orange uppercase">Empresa</label>
            <input type="text" disabled={isSubmitting} value={company} onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-orange uppercase">Email</label>
              <input type="email" disabled={isSubmitting} value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
            </div>
            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-orange uppercase">Telefone</label>
              <input type="text" disabled={isSubmitting} value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-orange uppercase">Segmento</label>
              <select disabled={isSubmitting} value={segment} onChange={(e) => setSegment(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange">
                <option value="direct">Direto</option>
                <option value="agency">Agência</option>
                <option value="brand">Marca</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-orange uppercase">Status</label>
              <select disabled={isSubmitting} value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange">
                <option value="lead">Lead</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-frame-gray-3">
            <h4 className="font-frame-mono text-xs text-frame-orange uppercase">Endereço</h4>
            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Endereço</label>
              <input type="text" disabled={isSubmitting} value={address} onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Cidade</label>
                <input type="text" disabled={isSubmitting} value={city} onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
              </div>
              <div className="space-y-2"><label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Estado</label>
                <input type="text" disabled={isSubmitting} value={state} onChange={(e) => setState(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
              </div>
              <div className="space-y-2"><label className="block font-frame-mono text-xs text-frame-gray-light uppercase">País</label>
                <input type="text" disabled={isSubmitting} value={country} onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-frame-gray-3">
            <h4 className="font-frame-mono text-xs text-frame-orange uppercase">Redes Sociais</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Website</label>
                <input type="url" disabled={isSubmitting} value={website} onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
              </div>
              <div className="space-y-2"><label className="block font-frame-mono text-xs text-frame-gray-light uppercase">LinkedIn</label>
                <input type="url" disabled={isSubmitting} value={linkedin} onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
              </div>
              <div className="space-y-2"><label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Instagram</label>
                <input type="url" disabled={isSubmitting} value={instagram} onChange={(e) => setInstagram(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-frame-gray-3">
            <h4 className="font-frame-mono text-xs text-frame-orange uppercase">Informações da Empresa</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Indústria</label>
                <input type="text" disabled={isSubmitting} value={industry} onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
              </div>
              <div className="space-y-2"><label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Tamanho</label>
                <select disabled={isSubmitting} value={companySize} onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange">
                  <option value="">Selecione</option>
                  <option value="1-10">1-10 funcionários</option>
                  <option value="11-50">11-50 funcionários</option>
                  <option value="51-200">51-200 funcionários</option>
                  <option value="201-500">201-500 funcionários</option>
                  <option value="500+">500+ funcionários</option>
                </select>
              </div>
              <div className="space-y-2"><label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Receita Anual (R$)</label>
                <input type="number" disabled={isSubmitting} value={annualRevenue} onChange={(e) => setAnnualRevenue(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-frame-gray-3">
            <h4 className="font-frame-mono text-xs text-frame-orange uppercase">Contato Principal</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Pessoa</label>
                <input type="text" disabled={isSubmitting} value={contactPerson} onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
              </div>
              <div className="space-y-2"><label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Cargo</label>
                <input type="text" disabled={isSubmitting} value={contactRole} onChange={(e) => setContactRole(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-frame-gray-3">
            <h4 className="font-frame-mono text-xs text-frame-orange uppercase">Financeiro</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Ciclo</label>
                <select disabled={isSubmitting} value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange">
                  <option value="">Selecione</option>
                  <option value="monthly">Mensal</option>
                  <option value="quarterly">Trimestral</option>
                  <option value="annual">Anual</option>
                  <option value="project">Por Projeto</option>
                </select>
              </div>
              <div className="space-y-2"><label className="block font-frame-mono text-xs text-frame-gray-light uppercase">Pagamento</label>
                <select disabled={isSubmitting} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange">
                  <option value="">Selecione</option>
                  <option value="pix">PIX</option>
                  <option value="bank_transfer">Transferência</option>
                  <option value="credit_card">Cartão</option>
                  <option value="boleto">Boleto</option>
                </select>
              </div>
              <div className="space-y-2"><label className="block font-frame-mono text-xs text-frame-gray-light uppercase">CNPJ/CPF</label>
                <input type="text" disabled={isSubmitting} value={taxId} onChange={(e) => setTaxId(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange" />
              </div>
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t border-frame-gray-3">
            <label className="block font-frame-mono text-xs text-frame-orange uppercase">Notas</label>
            <textarea disabled={isSubmitting} value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange resize-none" rows={3} />
          </div>
        </form>
      </AnimatedModal>

      {/* Delete Modal */}
      <AnimatedModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="EXCLUIR CLIENTE"
        description="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
        footer={
          <div className="flex gap-3 w-full">
            <button type="button" onClick={() => setIsDeleteOpen(false)} disabled={isSubmitting} className="frame-btn-ghost flex-1">
              Cancelar
            </button>
            <button type="button" onClick={handleDelete} disabled={isSubmitting} className="frame-btn-danger flex-1">
              {isSubmitting ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        }
      >
        <div className="flex items-center gap-4 mt-4 p-4 border border-frame-red/30 bg-frame-red/5">
          <Trash2 className="w-5 h-5 text-frame-red shrink-0" />
          <div>
            <p className="font-semibold text-frame-white">{selectedClient?.name}</p>
            {selectedClient?.company && (
              <p className="text-sm text-frame-gray-light">{selectedClient.company}</p>
            )}
          </div>
        </div>
      </AnimatedModal>
    </div>
  );
}

export default function Clients() {
  return (
    <ProtectedRoute>
      <ClientsContent />
    </ProtectedRoute>
  );
}
