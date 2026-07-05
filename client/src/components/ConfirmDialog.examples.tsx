/**
 * ConfirmDialog - Usage Examples
 *
 * This file contains example implementations of the ConfirmDialog component
 * for different use cases and variants.
 */

import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

// ============================================================================
// EXAMPLE 1: Delete Confirmation (variant: "delete")
// ============================================================================

export function DeleteClientExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // API call to delete client
      await fetch("/api/clients/123", { method: "DELETE" });
      setIsOpen(false);
      // Show success toast
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Delete Client</button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Deletar Cliente"
        description="Tem certeza que deseja deletar este cliente? Todos os dados associados serão removidos."
        confirmText="Deletar"
        cancelText="Cancelar"
        variant="delete"
        isLoading={isLoading}
        itemName="Acme Corporation"
      />
    </>
  );
}

// ============================================================================
// EXAMPLE 2: Warning Confirmation (variant: "warning")
// ============================================================================

export function ArchiveProjectExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleArchive = async () => {
    setIsLoading(true);
    try {
      // API call to archive project
      await fetch("/api/projects/456/archive", { method: "POST" });
      setIsOpen(false);
      // Show success toast
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Archive Project</button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleArchive}
        title="Arquivar Projeto"
        description="Este projeto será movido para arquivos mortos. Você pode restaurá-lo posteriormente se necessário."
        confirmText="Arquivar"
        cancelText="Cancelar"
        variant="warning"
        isLoading={isLoading}
        itemName="Campanha Summer 2026"
      />
    </>
  );
}

// ============================================================================
// EXAMPLE 3: Info Confirmation (variant: "info")
// ============================================================================

export function ExportDataExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      // API call to export data
      const response = await fetch("/api/export/clients");
      const blob = await response.blob();
      // Download file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "clients-export.csv";
      a.click();
      setIsOpen(false);
      // Show success toast
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Export Clients</button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleExport}
        title="Exportar Clientes"
        description="Um arquivo CSV será gerado com todos os clientes. O download iniciará automaticamente."
        confirmText="Exportar"
        cancelText="Cancelar"
        variant="info"
        isLoading={isLoading}
      />
    </>
  );
}

// ============================================================================
// EXAMPLE 4: Async Confirmation with Error Handling
// ============================================================================

export function PublishContentExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/content/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId: 789 }),
      });

      if (!response.ok) {
        throw new Error("Failed to publish");
      }

      setIsOpen(false);
      // Show success toast
    } catch (error) {
      setError("Erro ao publicar conteúdo. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Publish Content</button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handlePublish}
        title="Publicar Conteúdo"
        description="Este conteúdo ficará visível publicamente. Certifique-se de que está pronto para publicação."
        confirmText="Publicar Agora"
        cancelText="Revisar Novamente"
        variant="warning"
        isLoading={isLoading}
        itemName="Artigo: 10 Dicas de Produção"
      />

      {error && (
        <div className="error-message">{error}</div>
      )}
    </>
  );
}

// ============================================================================
// EXAMPLE 5: Without itemName (simpler UI)
// ============================================================================

export function LogoutExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Clear session
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Logout</button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleLogout}
        title="Sair da Conta"
        description="Você será desconectado e redirecionado para a página de login."
        confirmText="Sair"
        cancelText="Ficar Conectado"
        variant="warning"
      />
    </>
  );
}

// ============================================================================
// BEST PRACTICES
// ============================================================================

/**
 * 1. VARIANT SELECTION:
 *    - delete: Destructive actions (cannot be undone)
 *    - warning: Important actions with reversible consequences
 *    - info: Informative confirmations (exports, downloads)
 *
 * 2. ASYNC HANDLING:
 *    - Always use isLoading prop during API calls
 *    - Handle errors gracefully
 *    - Close dialog only on success
 *
 * 3. ACCESSIBILITY:
 *    - Dialog closes on ESC key
 *    - Prevents body scroll when open
 *    - Focus management automatic
 *    - Keyboard navigation supported
 *
 * 4. UX TIPS:
 *    - Use itemName to show what's being affected
 *    - Keep descriptions clear and concise
 *    - Use action verbs in confirmText ("Delete", "Archive", "Export")
 *    - Provide cancel alternative ("Cancel", "Go Back", "Review")
 */
