import { Copy, Download, History, MessageSquare, RefreshCw, FileText } from "lucide-react";

interface ActionToolbarProps {
  onCopy: () => void;
  onDownload: () => void;
  onClear: () => void;
  onToggleHistory: () => void;
  activeTab: "document" | "refine";
  onChangeTab: (tab: "document" | "refine") => void;
  hasOutput: boolean;
}

export default function ActionToolbar({
  onCopy,
  onDownload,
  onClear,
  onToggleHistory,
  activeTab,
  onChangeTab,
  hasOutput,
}: ActionToolbarProps) {
  return (
    <div className="px-6 py-3 border-b border-frame-gray-2 flex flex-wrap items-center justify-between gap-3 bg-frame-gray-1/40 shrink-0 select-none">
      {/* Segmented Tab Selector (Document vs Refinement Chat) */}
      <div className="flex bg-frame-gray-1 p-0.5 border border-frame-gray-3">
        <button
          type="button"
          onClick={() => onChangeTab("document")}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-frame-mono text-[0.6rem] tracking-[0.1em] uppercase transition ${
            activeTab === "document"
              ? "bg-frame-orange text-frame-black font-medium"
              : "text-frame-gray-light hover:text-frame-white"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Documento
        </button>
        <button
          type="button"
          onClick={() => onChangeTab("refine")}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-frame-mono text-[0.6rem] tracking-[0.1em] uppercase transition ${
            activeTab === "refine"
              ? "bg-frame-orange text-frame-black font-medium"
              : "text-frame-gray-light hover:text-frame-white"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Refinar com IA
        </button>
      </div>

      {/* Operation Actions */}
      <div className="flex items-center gap-1.5">
        {hasOutput && (
          <>
            <button
              type="button"
              onClick={onCopy}
              title="Copiar para clipboard"
              className="font-frame-mono text-[0.6rem] tracking-[0.1em] uppercase px-3 py-2 border border-frame-gray-3 text-frame-gray-light bg-transparent transition hover:border-frame-gray-muted hover:text-frame-white flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copiar</span>
            </button>
            <button
              type="button"
              onClick={onDownload}
              title="Baixar arquivo .txt"
              className="font-frame-mono text-[0.6rem] tracking-[0.1em] uppercase px-3 py-2 border border-frame-gray-3 text-frame-gray-light bg-transparent transition hover:border-frame-gray-muted hover:text-frame-white flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </>
        )}

        <button
          type="button"
          onClick={onClear}
          title="Limpar todos os campos"
          className="font-frame-mono text-[0.6rem] tracking-[0.1em] uppercase px-3 py-2 border border-frame-gray-3 text-frame-gray-light bg-transparent transition hover:border-frame-red/40 hover:text-frame-red flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Limpar</span>
        </button>

        <button
          type="button"
          onClick={onToggleHistory}
          title="Ver histórico de gerações"
          className="font-frame-mono text-[0.6rem] tracking-[0.1em] uppercase px-3 py-2 border border-frame-gray-3 text-frame-gray-light bg-transparent transition hover:border-frame-gold/40 hover:text-frame-gold flex items-center gap-1.5"
        >
          <History className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Histórico</span>
        </button>
      </div>
    </div>
  );
}
