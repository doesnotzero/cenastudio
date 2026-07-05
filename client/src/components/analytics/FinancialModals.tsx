import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FinancialEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

type KindType = "income" | "expense";

export function FinancialEntryModal({ open, onOpenChange, onSubmit }: FinancialEntryModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    kind: "income" as KindType,
    description: "",
    category: "projeto",
    amount: "",
    status: "pending" as const,
    dueDate: "",
    recurrence: "once" as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/75 z-50"
            onClick={() => onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-ds-surface-1 rounded-xl shadow-2xl border border-ds-surface-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-ds-surface-3">
              <h2 className="text-lg font-semibold">Novo Lançamento</h2>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 hover:text-ds-orange transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(f => ({ ...f, kind: "income" }))}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all",
                    formData.kind === "income" 
                      ? "border-ds-success bg-ds-success/10 text-ds-success" 
                      : "border-ds-surface-3 hover:border-ds-text-3"
                  )}
                >
                  <FileText className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Receita</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(f => ({ ...f, kind: "expense" }))}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all",
                    formData.kind === "expense" 
                      ? "border-ds-danger bg-ds-danger/10 text-ds-danger" 
                      : "border-ds-surface-3 hover:border-ds-text-3"
                  )}
                >
                  <FileText className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Despesa</span>
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Descrição"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-ds-surface-2 rounded-lg outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Valor (R$)"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-ds-surface-2 rounded-lg outline-none"
                  required
                />
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-ds-surface-2 rounded-lg outline-none"
                >
                  <option value="projeto">Projeto</option>
                  <option value="cliente">Cliente</option>
                  <option value="operacao">Operação</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-ds-orange rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2 border border-ds-surface-3 rounded-lg text-ds-text-2 hover:text-ds-text-1"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: "csv" | "pdf") => void;
}

export function ExportModal({ open, onOpenChange, onExport }: ExportModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/75 z-50"
            onClick={() => onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-64 bg-ds-surface-1 rounded-xl shadow-2xl border border-ds-surface-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-4 space-y-2">
              <button
                onClick={() => onExport("csv")}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-ds-surface-2 transition-colors text-left"
              >
                <Download className="w-5 h-5 text-ds-orange" />
                <span>Exportar CSV</span>
              </button>
              <button
                onClick={() => onExport("pdf")}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-ds-surface-2 transition-colors text-left"
              >
                <FileText className="w-5 h-5 text-ds-orange" />
                <span>Exportar PDF</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}