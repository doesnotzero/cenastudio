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

interface Client {
  id: number;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  segment: string;
  status: string;
  notes?: string;
  total_spent: number;
  created_at: string;
  updated_at: string;
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

        {/* Clients List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-frame-orange" />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="border border-dashed border-frame-gray-3 p-12 text-center">
            <Users className="w-12 h-12 text-frame-gray-light mx-auto mb-4" />
            <p className="text-frame-gray-light mb-4">Nenhum cliente encontrado</p>
            <button
              onClick={() => {
                resetForm();
                setIsCreateOpen(true);
              }}
              className="frame-btn-ghost"
            >
              Criar Primeiro Cliente
            </button>
          </div>
        ) : (
          <div className="border border-frame-gray-3 bg-frame-gray-1/10 divide-y divide-frame-gray-3">
            {filteredClients.map((client) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-frame-gray-1/30 transition duration-150"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-frame-white truncate">
                        {client.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-frame-mono border rounded ${getStatusColor(client.status)}`}
                      >
                        {getStatusLabel(client.status)}
                      </span>
                    </div>

                    {client.company && (
                      <div className="flex items-center gap-2 text-frame-gray-light text-sm mb-2">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{client.company}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-frame-gray-light">
                      {client.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{formatCurrency(client.total_spent)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(client.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-frame-gray-2 transition rounded-none">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-frame-black border-frame-gray-3">
                      <DropdownMenuItem
                        onClick={() => setLocation(`/clients/${client.id}`)}
                        className="cursor-pointer"
                      >
                        Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openEditModal(client)}
                        className="cursor-pointer"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedClient(client);
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
              </motion.div>
            ))}
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
                  type="tel"
                  disabled={isSubmitting}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none"
                  placeholder="(11) 99999-9999"
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
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none resize-none h-20"
                placeholder="Observações sobre o cliente..."
              />
            </div>

            <DialogFooter className="gap-2 pt-4 border-t border-frame-gray-3">
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
                disabled={isSubmitting || !name.trim()}
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

          <form onSubmit={handleUpdate} className="space-y-4 mt-4">
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
                  type="tel"
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
                className="w-full bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange rounded-none resize-none h-20"
              />
            </div>

            <DialogFooter className="gap-2 pt-4 border-t border-frame-gray-3">
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
                disabled={isSubmitting || !name.trim()}
                className="frame-btn-primary"
              >
                {isSubmitting ? "Atualizando..." : "Atualizar Cliente"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-frame-black border-frame-gray-3 text-frame-white max-w-sm rounded-none p-6">
          <DialogHeader>
            <DialogTitle className="frame-title text-2xl text-frame-red">EXCLUIR CLIENTE?</DialogTitle>
            <DialogDescription className="text-frame-gray-light text-sm">
              Esta ação é permanente. Todos os dados do cliente serão apagados.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-4 border-t border-frame-gray-3">
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
