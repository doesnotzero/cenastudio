import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import AppNavBar from "@/components/AppNavBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Building2,
  MoreVertical,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Calendar,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
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

function SortableClientCard({ client, onEdit, onDelete }: { client: Client; onEdit: (client: Client) => void; onDelete: (client: Client) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: client.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const stage = WORKFLOW_STAGES.find(s => s.id === client.workflow_stage) || WORKFLOW_STAGES[0];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`border ${stage.color} rounded-lg p-4 mb-3 cursor-grab active:cursor-grabbing hover:border-frame-orange/50 transition-colors`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-frame-white">{client.name}</h4>
          {client.company && <p className="text-xs text-frame-gray-light mt-1">{client.company}</p>}
        </div>
        <div {...listeners} className="cursor-grab">
          <GripVertical className="w-4 h-4 text-frame-gray-light" />
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-frame-gray-light mt-2">
        {client.email && <Mail className="w-3 h-3" />}
        {client.phone && <Phone className="w-3 h-3" />}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-frame-gray-3">
        <span className="text-xs text-frame-gray-light">
          {formatCurrency(client.total_spent)}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-frame-gray-3 rounded transition-colors">
              <MoreVertical className="w-4 h-4 text-frame-gray-light" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(client)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(client)} className="text-red-400">
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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

  // Form states
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [segment, setSegment] = useState("direct");
  const [status, setStatus] = useState("lead");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSegment, setFilterSegment] = useState("");

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = clients.findIndex((c) => c.id === active.id);
      const newIndex = clients.findIndex((c) => c.id === over.id);
      
      const newClients = arrayMove(clients, oldIndex, newIndex);
      setClients(newClients);

      // Update workflow stage if dropped on a different stage column
      const overStage = WORKFLOW_STAGES.find((s) => s.id === over.id);
      if (overStage) {
        const client = clients.find((c) => c.id === active.id);
        if (client && client.workflow_stage !== overStage.id) {
          try {
            await fetch(`/api/clients/${client.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ workflow_stage: overStage.id }),
            });
            toast.success(`Cliente movido para ${overStage.label}`);
          } catch (error) {
            toast.error("Erro ao atualizar estágio do cliente");
          }
        }
      }
    }
  };

  useEffect(() => {
    loadClients();
    loadStats();
  }, []);

  useEffect(() => {
    loadClients();
  }, [filterStatus, filterSegment]);

  const loadClients = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      if (filterSegment) params.append("segment", filterSegment);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/clients?${params}`);
      const data = await response.json();
      if (data.success) {
        setClients(data.data);
      }
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("/api/clients/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
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
          name: name.trim(),
          company: company.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          segment,
          status,
          notes: notes.trim() || undefined,
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
    } catch (error) {
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
          name: name.trim(),
          company: company.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          segment,
          status,
          notes: notes.trim() || undefined,
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
    } catch (error) {
      toast.error("Erro ao atualizar cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClient) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: "DELETE",
      });

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
    } catch (error) {
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
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setSegment("direct");
    setStatus("lead");
    setNotes("");
    setSelectedClient(null);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "lead":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "inactive":
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "lead":
        return "Lead";
      case "inactive":
        return "Inativo";
      default:
        return status;
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="min-h-screen bg-frame-black text-frame-white font-frame-body flex flex-col">
      <AppNavBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="frame-label mb-2">// CRM</p>
            <h1 className="frame-title text-[clamp(2.1rem,4vw,3.5rem)]">
              CLIENTES
            </h1>
            <p className="text-frame-gray-light text-sm mt-2">
              Gerencie seu portfólio de clientes e oportunidades
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
            Novo Cliente
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-frame-gray-3 bg-frame-gray-1/30 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-frame-orange/10 rounded-lg">
                  <Users className="w-5 h-5 text-frame-orange" />
                </div>
                <div>
                  <p className="text-[0.65rem] text-frame-gray-light font-frame-mono uppercase tracking-wider">
                    Total
                  </p>
                  <p className="text-2xl font-bold">{stats.totalClients}</p>
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
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-[0.65rem] text-frame-gray-light font-frame-mono uppercase tracking-wider">
                    Ativos
                  </p>
                  <p className="text-2xl font-bold">{stats.activeClients}</p>
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
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-[0.65rem] text-frame-gray-light font-frame-mono uppercase tracking-wider">
                    Leads
                  </p>
                  <p className="text-2xl font-bold">{stats.leadClients}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-frame-gray-3 bg-frame-gray-1/30 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-[0.65rem] text-frame-gray-light font-frame-mono uppercase tracking-wider">
                    Receita
                  </p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-frame-gray-light" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-frame-gray-2 border border-frame-gray-3 pl-10 pr-4 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-frame-gray-2 border border-frame-gray-3 px-4 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
          >
            <option value="">Todos os Status</option>
            <option value="active">Ativo</option>
            <option value="lead">Lead</option>
            <option value="inactive">Inativo</option>
          </select>

          <select
            value={filterSegment}
            onChange={(e) => setFilterSegment(e.target.value)}
            className="bg-frame-gray-2 border border-frame-gray-3 px-4 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
          >
            <option value="">Todos os Segmentos</option>
            <option value="direct">Direto</option>
            <option value="agency">Agência</option>
            <option value="brand">Marca</option>
          </select>
        </div>

        {/* Kanban Board */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {WORKFLOW_STAGES.map((stage) => (
              <div key={stage.id} className={`border ${stage.color} rounded-lg p-4 min-w-[280px]`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm text-frame-white">{stage.label}</h3>
                  <span className="text-xs text-frame-gray-light">
                    {clients.filter(c => c.workflow_stage === stage.id).length}
                  </span>
                </div>
                
                <SortableContext items={clients.filter(c => c.workflow_stage === stage.id).map(c => c.id)} strategy={verticalListSortingStrategy}>
                  {clients.filter(c => c.workflow_stage === stage.id).map((client) => (
                    <SortableClientCard
                      key={client.id}
                      client={client}
                      onEdit={openEditModal}
                      onDelete={(c) => {
                        setSelectedClient(c);
                        setIsDeleteOpen(true);
                      }}
                    />
                  ))}
                </SortableContext>
              </div>
            ))}
          </div>
        </DndContext>

        {/* Empty State */}
        {clients.length === 0 && (
          <div className="border border-dashed border-frame-gray-3 p-12 text-center">
            <Users className="w-12 h-12 text-frame-gray-light mx-auto mb-4" />
            <p className="text-frame-gray-light mb-4">Nenhum cliente encontrado</p>
            <button
              onClick={() => {
                resetForm();
                setIsCreateOpen(true);
              }}
              className="frame-btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Cliente
            </button>
          </div>
        )}
      </main>

      {/* Create Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-frame-black border-frame-gray-3 text-frame-white max-w-md rounded-none p-6">
          <DialogHeader>
            <DialogTitle className="frame-title text-2xl">NOVO CLIENTE</DialogTitle>
            <DialogDescription className="text-frame-gray-light text-sm">
              Adicione um novo cliente ao seu CRM
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                Nome *
              </label>
              <input
                type="text"
                required
                disabled={isSubmitting}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                placeholder="Nome do cliente"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                Empresa
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                placeholder="Nome da empresa"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                  Email
                </label>
                <input
                  type="email"
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                  Telefone
                </label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                  placeholder="+55 11 99999-9999"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                  Segmento
                </label>
                <select
                  disabled={isSubmitting}
                  value={segment}
                  onChange={(e) => setSegment(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                >
                  <option value="direct">Direto</option>
                  <option value="agency">Agência</option>
                  <option value="brand">Marca</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                  Status
                </label>
                <select
                  disabled={isSubmitting}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                >
                  <option value="lead">Lead</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                Notas
              </label>
              <textarea
                disabled={isSubmitting}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none resize-none"
                rows={3}
                placeholder="Observações sobre o cliente..."
              />
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                disabled={isSubmitting}
                className="frame-btn-ghost"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="frame-btn-primary"
              >
                {isSubmitting ? "Criando..." : "Criar Cliente"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-frame-black border-frame-gray-3 text-frame-white max-w-md rounded-none p-6">
          <DialogHeader>
            <DialogTitle className="frame-title text-2xl">EDITAR CLIENTE</DialogTitle>
            <DialogDescription className="text-frame-gray-light text-sm">
              Atualize as informações do cliente
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEdit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                Nome *
              </label>
              <input
                type="text"
                required
                disabled={isSubmitting}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                Empresa
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                  Email
                </label>
                <input
                  type="email"
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                  Telefone
                </label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                  Segmento
                </label>
                <select
                  disabled={isSubmitting}
                  value={segment}
                  onChange={(e) => setSegment(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                >
                  <option value="direct">Direto</option>
                  <option value="agency">Agência</option>
                  <option value="brand">Marca</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                  Status
                </label>
                <select
                  disabled={isSubmitting}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                >
                  <option value="lead">Lead</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-frame-mono text-xs text-frame-orange uppercase">
                Notas
              </label>
              <textarea
                disabled={isSubmitting}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none resize-none"
                rows={3}
              />
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                disabled={isSubmitting}
                className="frame-btn-ghost"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="frame-btn-primary"
              >
                {isSubmitting ? "Atualizando..." : "Atualizar"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-frame-black border-frame-gray-3 text-frame-white max-w-md rounded-none p-6">
          <DialogHeader>
            <DialogTitle className="frame-title text-2xl">EXCLUIR CLIENTE</DialogTitle>
            <DialogDescription className="text-frame-gray-light text-sm">
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 mt-4 p-4 border border-frame-red/30 bg-frame-red/5">
            <Trash2 className="w-5 h-5 text-frame-red" />
            <div>
              <p className="font-semibold text-frame-white">{selectedClient?.name}</p>
              {selectedClient?.company && (
                <p className="text-sm text-frame-gray-light">{selectedClient.company}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isSubmitting}
              className="frame-btn-ghost"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="frame-btn-danger"
            >
              {isSubmitting ? "Excluindo..." : "Excluir"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
