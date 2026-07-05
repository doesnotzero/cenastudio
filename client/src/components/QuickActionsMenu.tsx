import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Home,
  FolderKanban,
  Users,
  Target,
  Video,
  Settings,
  Plus,
  FileText,
  BarChart3,
  Command,
  X,
} from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
  category: "navigation" | "create" | "settings";
}

export default function QuickActionsMenu() {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Listen for Cmd+K / Ctrl+K
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC to close
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearch("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Listen for custom event (from AppNavBar and CommandPalette via Cmd+K)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("cena:open-command-palette", handleOpen);
    return () => window.removeEventListener("cena:open-command-palette", handleOpen);
  }, []);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const actions: QuickAction[] = [
    // Navigation
    {
      id: "nav-dashboard",
      label: "Dashboard",
      description: "Ver visão geral do dia",
      icon: Home,
      action: () => setLocation("/dashboard"),
      shortcut: "⌘ D",
      category: "navigation",
    },
    {
      id: "nav-projects",
      label: "Projetos",
      description: "Ver todos os projetos",
      icon: FolderKanban,
      action: () => setLocation("/projects"),
      shortcut: "⌘ P",
      category: "navigation",
    },
    {
      id: "nav-clients",
      label: "Clientes",
      description: "Gerenciar clientes",
      icon: Users,
      action: () => setLocation("/clients"),
      shortcut: "⌘ C",
      category: "navigation",
    },
    {
      id: "nav-pipeline",
      label: "Pipeline",
      description: "Acompanhar oportunidades",
      icon: Target,
      action: () => setLocation("/pipeline"),
      shortcut: "⌘ L",
      category: "navigation",
    },
    {
      id: "nav-video-reviews",
      label: "Video Reviews",
      description: "Revisar vídeos",
      icon: Video,
      action: () => setLocation("/video-reviews"),
      shortcut: "⌘ V",
      category: "navigation",
    },
    {
      id: "nav-analytics",
      label: "Analytics",
      description: "Ver métricas",
      icon: BarChart3,
      action: () => setLocation("/analytics"),
      category: "navigation",
    },

    // Create Actions
    {
      id: "create-project",
      label: "Novo Projeto",
      description: "Criar um novo projeto",
      icon: Plus,
      action: () => {
        setLocation("/dashboard?newProject=1");
      },
      shortcut: "⌘ N",
      category: "create",
    },
    {
      id: "create-client",
      label: "Novo Cliente",
      description: "Adicionar novo cliente",
      icon: Plus,
      action: () => setLocation("/clients/new"),
      category: "create",
    },
    {
      id: "create-opportunity",
      label: "Nova Oportunidade",
      description: "Adicionar ao pipeline",
      icon: Plus,
      action: () => setLocation("/pipeline?new=1"),
      category: "create",
    },

    // Settings
    {
      id: "settings",
      label: "Configurações",
      description: "Ajustes da conta",
      icon: Settings,
      action: () => setLocation("/settings"),
      category: "settings",
    },
  ];

  const filteredActions = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return actions;

    return actions.filter(
      (action) =>
        action.label.toLowerCase().includes(term) ||
        action.description.toLowerCase().includes(term)
    );
  }, [search]);

  const handleSelectAction = (action: QuickAction) => {
    action.action();
    setIsOpen(false);
    setSearch("");
  };

  const groupedActions = useMemo(() => {
    const groups: Record<string, QuickAction[]> = {
      navigation: [],
      create: [],
      settings: [],
    };

    filteredActions.forEach((action) => {
      groups[action.category].push(action);
    });

    return groups;
  }, [filteredActions]);

  const categoryLabels = {
    navigation: "Navegação",
    create: "Criar",
    settings: "Configurações",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => {
              setIsOpen(false);
              setSearch("");
            }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
          />

          {/* Command Palette */}
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl bg-frame-gray-1 border border-frame-gray-3 shadow-2xl overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-frame-gray-3">
                <Search className="w-5 h-5 text-frame-gray-light shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar ações... (ou use atalhos)"
                  autoFocus
                  className="flex-1 bg-transparent outline-none text-frame-white placeholder:text-frame-gray-light"
                />
                <div className="flex items-center gap-2 text-xs text-frame-gray-light">
                  <kbd className="px-2 py-1 bg-frame-gray-2 border border-frame-gray-3 rounded font-frame-mono">
                    <Command className="w-3 h-3 inline" />K
                  </kbd>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className="p-1 hover:bg-frame-gray-2 rounded transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions List */}
              <div className="max-h-[60vh] overflow-y-auto">
                {filteredActions.length === 0 ? (
                  <div className="py-12 text-center text-frame-gray-light text-sm">
                    Nenhuma ação encontrada
                  </div>
                ) : (
                  <>
                    {Object.entries(groupedActions).map(([category, categoryActions]) => {
                      if (categoryActions.length === 0) return null;

                      return (
                        <div key={category} className="py-2">
                          <div className="px-4 py-2">
                            <p className="text-xs font-frame-mono uppercase tracking-wider text-frame-orange">
                              {categoryLabels[category as keyof typeof categoryLabels]}
                            </p>
                          </div>
                          <div>
                            {categoryActions.map((action) => {
                              const Icon = action.icon;
                              return (
                                <button
                                  key={action.id}
                                  onClick={() => handleSelectAction(action)}
                                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-frame-gray-2 transition group"
                                >
                                  <div className="p-2 rounded bg-frame-gray-2 group-hover:bg-frame-gray-3 transition">
                                    <Icon className="w-4 h-4 text-frame-gray-light group-hover:text-frame-white transition" />
                                  </div>
                                  <div className="flex-1 text-left min-w-0">
                                    <p className="text-sm font-medium text-frame-white group-hover:text-frame-orange transition">
                                      {action.label}
                                    </p>
                                    <p className="text-xs text-frame-gray-light truncate">
                                      {action.description}
                                    </p>
                                  </div>
                                  {action.shortcut && (
                                    <kbd className="px-2 py-1 text-xs font-frame-mono bg-frame-gray-2 border border-frame-gray-3 rounded text-frame-gray-light">
                                      {action.shortcut}
                                    </kbd>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-frame-gray-3 bg-frame-gray-2/50">
                <div className="flex items-center gap-4 text-xs text-frame-gray-light">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-frame-gray-3 rounded">↑↓</kbd> Navegar
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-frame-gray-3 rounded">Enter</kbd> Selecionar
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-frame-gray-3 rounded">Esc</kbd> Fechar
                  </span>
                </div>
                <p className="text-xs text-frame-gray-light font-frame-mono">
                  {filteredActions.length} ações
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
