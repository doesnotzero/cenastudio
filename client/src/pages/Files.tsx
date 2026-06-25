import React, { useEffect, useState } from "react";
import { useParams } from "wouter";
import AppNavBar from "@/components/AppNavBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProjectGateway from "@/components/ProjectGateway";
import {
  Upload,
  Download,
  Trash2,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  File,
  Folder,
  Plus,
  X,
  Loader2,
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
import { motion } from "framer-motion";

interface FileData {
  id: number;
  user_id?: number;
  project_id: number | null;
  filename: string;
  original_name: string;
  mime_type: string | null;
  size: number | null;
  path: string;
  created_at: string;
}

function FilesContent() {
  const params = useParams();
  const projectId = params.projectId ? parseInt(params.projectId) : null;

  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);

  // Upload states
  const [selectedFileForUpload, setSelectedFileForUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (projectId) {
      loadFiles();
    }
  }, [projectId]);

  const loadFiles = async () => {
    if (!projectId) return;

    try {
      const response = await fetch(`/api/files/projects/${projectId}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setFiles(data.data);
      }
    } catch (error) {
      console.error("Error loading files:", error);
      toast.error("Erro ao carregar arquivos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileForUpload(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFileForUpload || !projectId) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        setUploadProgress(50);

        const response = await fetch("/api/files/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            fileName: selectedFileForUpload.name,
            fileType: selectedFileForUpload.type,
            fileSize: selectedFileForUpload.size,
            fileData: base64.split(",")[1], // Remove data URL prefix
          }),
        });

        setUploadProgress(100);

        const data = await response.json();
        if (data.success) {
          toast.success("Arquivo enviado com sucesso!");
          setIsUploadOpen(false);
          setSelectedFileForUpload(null);
          loadFiles();
        } else {
          toast.error(data.error || "Erro ao enviar arquivo");
        }
      };

      reader.onerror = () => {
        toast.error("Erro ao ler arquivo");
        setIsUploading(false);
      };

      reader.readAsDataURL(selectedFileForUpload);
    } catch (error) {
      toast.error("Erro ao enviar arquivo");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!selectedFile) return;

    try {
      const response = await fetch(`/api/files/${selectedFile.id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Arquivo excluído com sucesso!");
        setIsDeleteOpen(false);
        setSelectedFile(null);
        loadFiles();
      } else {
        toast.error(data.error || "Erro ao excluir arquivo");
      }
    } catch (error) {
      toast.error("Erro ao excluir arquivo");
    }
  };

  const handleDownload = (file: FileData) => {
    window.open(`/api/files/${file.id}/download`, "_blank");
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return ImageIcon;
    if (fileType.startsWith("video/")) return Video;
    if (fileType.startsWith("audio/")) return Music;
    if (fileType.includes("pdf")) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!projectId) {
    return (
      <div className="min-h-screen bg-frame-black text-frame-white font-frame-body flex flex-col">
        <AppNavBar />
        <ProjectGateway
          eyebrow="// Arquivos"
          title="ARQUIVOS"
          description="Escolha ou crie um projeto para organizar documentos, roteiros, videos, referencias e entregaveis."
          actionLabel="Criar e abrir arquivos"
          routeBase="files"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-frame-black text-frame-white font-frame-body flex flex-col">
      <AppNavBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="frame-label mb-2">// PROJETO #{projectId}</p>
            <h1 className="frame-title text-[clamp(2.1rem,4vw,3.5rem)]">
              ARQUIVOS
            </h1>
            <p className="text-frame-gray-light text-sm mt-2">
              Gerencie os arquivos do projeto
            </p>
          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="frame-btn-primary flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload de Arquivo
          </button>
        </div>

        {/* Files List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-frame-orange" />
          </div>
        ) : files.length === 0 ? (
          <div className="border border-dashed border-frame-gray-3 p-12 text-center">
            <Folder className="w-12 h-12 text-frame-gray-light mx-auto mb-4" />
            <p className="text-frame-gray-light mb-4">
              Nenhum arquivo neste projeto
            </p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="frame-btn-ghost"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Arquivo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => {
              const Icon = getFileIcon(file.mime_type || "");

              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-frame-gray-3 bg-frame-gray-1/10 p-4 hover:border-frame-orange/50 transition group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 bg-frame-gray-2 rounded-lg">
                      <Icon className="w-6 h-6 text-frame-orange" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-2 hover:bg-frame-gray-3 transition rounded-none"
                        title="Baixar"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFile(file);
                          setIsDeleteOpen(true);
                        }}
                        className="p-2 hover:bg-frame-red/20 hover:text-frame-red transition rounded-none"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-frame-white mb-1 truncate">
                    {file.original_name}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-frame-gray-light mt-2">
                    <span>{formatFileSize(file.size || 0)}</span>
                    <span>{formatDate(file.created_at)}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Upload Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="bg-frame-black border-frame-gray-3 text-frame-white max-w-md rounded-none p-6">
          <DialogHeader>
            <DialogTitle className="frame-title text-2xl">UPLOAD DE ARQUIVO</DialogTitle>
            <DialogDescription className="text-frame-gray-light text-sm">
              Selecione um arquivo para enviar ao projeto
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {!selectedFileForUpload ? (
              <div className="border-2 border-dashed border-frame-gray-3 rounded-lg p-8 text-center hover:border-frame-orange/50 transition cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <Upload className="w-8 h-8 text-frame-gray-light" />
                  <p className="text-sm text-frame-gray-light">
                    Clique para selecionar um arquivo
                  </p>
                  <p className="text-xs text-frame-gray-light/60">
                    Imagens, vídeos, documentos, etc.
                  </p>
                </label>
              </div>
            ) : (
              <div className="border border-frame-gray-3 bg-frame-gray-1/10 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <File className="w-5 h-5 text-frame-orange shrink-0" />
                    <span className="text-sm truncate">{selectedFileForUpload.name}</span>
                  </div>
                  <button
                    onClick={() => setSelectedFileForUpload(null)}
                    className="p-1 hover:bg-frame-gray-3 transition rounded-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-frame-gray-light">
                  <span>{formatFileSize(selectedFileForUpload.size)}</span>
                  <span>{selectedFileForUpload.type || "Arquivo"}</span>
                </div>

                {isUploading && (
                  <div className="mt-3">
                    <div className="w-full bg-frame-gray-3 rounded-full h-2">
                      <div
                        className="bg-frame-orange h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-frame-gray-light mt-1 text-center">
                      {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-4 border-t border-frame-gray-3">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => {
                setIsUploadOpen(false);
                setSelectedFileForUpload(null);
              }}
              className="frame-btn-ghost"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!selectedFileForUpload || isUploading}
              onClick={handleUpload}
              className="frame-btn-primary"
            >
              {isUploading ? "Enviando..." : "Enviar Arquivo"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-frame-black border-frame-gray-3 text-frame-white max-w-sm rounded-none p-6">
          <DialogHeader>
            <DialogTitle className="frame-title text-2xl text-frame-red">
              EXCLUIR ARQUIVO?
            </DialogTitle>
            <DialogDescription className="text-frame-gray-light text-sm">
              Esta ação é permanente e não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-4 border-t border-frame-gray-3">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              className="frame-btn-ghost"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-frame-red hover:bg-red-600 text-white px-4 py-2 text-sm font-frame-mono uppercase tracking-wider transition rounded-none"
            >
              Excluir
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Files() {
  return (
    <ProtectedRoute>
      <FilesContent />
    </ProtectedRoute>
  );
}
