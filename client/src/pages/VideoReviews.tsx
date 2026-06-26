import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import AppNavBar from "@/components/AppNavBar";
import ProjectGateway from "@/components/ProjectGateway";
import ProtectedRoute from "@/components/ProtectedRoute";
import VideoPlayer from "@/components/VideoPlayer";
import {
  Play, Plus, Share2, MessageSquare, Clock, CheckCircle, XCircle,
  Trash2, Copy, ExternalLink, FileVideo, Link as LinkIcon, Upload,
  Film, CheckSquare, Square, AlertCircle, Send,
} from "lucide-react";
import { toast } from "sonner";

interface VideoReview {
  id: number;
  project_id: number;
  file_id: number;
  title: string;
  description: string | null;
  status: string;
  share_token: string | null;
  expires_at: string | null;
  original_name: string;
  file_path: string;
  created_at: string;
  updated_at: string;
  video_url?: string;
}

interface VideoComment {
  id: number;
  review_id: number;
  author_name: string;
  timestamp_seconds: number;
  comment: string;
  resolved: number;
  created_at: string;
}

interface ProjectFile {
  id: number;
  original_name: string;
  mime_type: string | null;
  size: number | null;
}

function VideoReviewsContent() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const [reviews, setReviews] = useState<VideoReview[]>([]);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [selectedReview, setSelectedReview] = useState<VideoReview | null>(null);
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewDescription, setNewReviewDescription] = useState("");
  const [selectedFileId, setSelectedFileId] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newCommentTimestamp, setNewCommentTimestamp] = useState<number | null>(null);
  const [seekTo, setSeekTo] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [driveLink, setDriveLink] = useState("");
  const [uploadMode, setUploadMode] = useState<"file" | "drive" | null>(null);
  const [selectedFileForUpload, setSelectedFileForUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadReviews();
      loadProjectFiles();
    } else {
      setLoading(false);
    }
  }, [projectId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/video-reviews/projects/${projectId}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch {
      toast.error("Erro ao carregar reviews");
    } finally {
      setLoading(false);
    }
  };

  const loadProjectFiles = async () => {
    if (!projectId) return;
    try {
      const response = await fetch(`/api/files/projects/${projectId}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setProjectFiles(data.data);
      }
    } catch {
      toast.error("Erro ao carregar arquivos do projeto");
    }
  };

  const resolveVideoUrl = useCallback((review: VideoReview): string => {
    if (review.video_url) return review.video_url;
    if (review.file_path) {
      if (review.file_path.startsWith("http")) return review.file_path;
      return `/api/files/${review.file_id}/download`;
    }
    return "";
  }, []);

  const loadReviewDetails = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/video-reviews/${reviewId}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setSelectedReview(data.data);
        setComments(data.data.comments || []);
        setPlayerReady(false);
        setSeekTo(null);
      }
    } catch {
      toast.error("Erro ao carregar detalhes do review");
    }
  };

  const handleCreateReview = async () => {
    if (!projectId) {
      toast.error("Selecione um projeto antes de criar review");
      return;
    }
    if (!newReviewTitle.trim()) {
      toast.error("Título é obrigatório");
      return;
    }
    if (!selectedFileId && !driveLink.trim() && !selectedFileForUpload) {
      toast.error("Selecione um vídeo, cole um link ou faça upload");
      return;
    }

    try {
      let fileId = selectedFileId ? parseInt(selectedFileId) : null;
      let videoUrl = driveLink.trim() || "";

      if (selectedFileForUpload && projectId) {
        setIsUploading(true);
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = reader.result as string;
          const response = await fetch("/api/files/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              projectId: parseInt(projectId),
              fileName: selectedFileForUpload.name,
              fileType: selectedFileForUpload.type,
              fileSize: selectedFileForUpload.size,
              fileData: base64.split(",")[1],
            }),
          });
          const data = await response.json();
          if (data.success) {
            fileId = data.data.id;
            await submitReview(fileId, videoUrl);
          } else {
            toast.error(data.error || "Erro ao fazer upload");
          }
          setIsUploading(false);
        };
        reader.readAsDataURL(selectedFileForUpload);
        return;
      }

      await submitReview(fileId, videoUrl);
    } catch {
      toast.error("Erro ao criar review");
      setIsUploading(false);
    }
  };

  const submitReview = async (fileId: number | null, videoUrl: string) => {
    const response = await fetch("/api/video-reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        projectId: parseInt(projectId!),
        fileId,
        title: newReviewTitle,
        description: newReviewDescription,
        videoUrl: videoUrl || undefined,
      }),
    });
    const data = await response.json();
    if (data.success) {
      toast.success("Review criado com sucesso!");
      setShowCreateModal(false);
      resetCreateForm();
      loadReviews();
    } else {
      toast.error(data.error || "Erro ao criar review");
    }
  };

  const resetCreateForm = () => {
    setNewReviewTitle("");
    setNewReviewDescription("");
    setSelectedFileId("");
    setDriveLink("");
    setSelectedFileForUpload(null);
    setUploadMode(null);
  };

  const handleGenerateShareLink = async () => {
    if (!selectedReview) return;
    try {
      const response = await fetch(`/api/video-reviews/${selectedReview.id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ expiresInDays: 7 }),
      });
      const data = await response.json();
      if (data.success) {
        setShareUrl(data.data.shareUrl);
        setShowShareModal(true);
        toast.success("Link gerado com sucesso!");
      }
    } catch {
      toast.error("Erro ao gerar link");
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copiado!");
  };

  const handleAddComment = async () => {
    if (!selectedReview || !newComment.trim()) {
      toast.error("Comentário é obrigatório");
      return;
    }
    try {
      const response = await fetch(`/api/video-reviews/${selectedReview.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          timestampSeconds: newCommentTimestamp ?? 0,
          comment: newComment,
          authorName: "Você",
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Comentário adicionado!");
        setNewComment("");
        setNewCommentTimestamp(null);
        loadReviewDetails(selectedReview.id);
      }
    } catch {
      toast.error("Erro ao adicionar comentário");
    }
  };

  const handleResolveComment = async (commentId: number, resolved: boolean) => {
    try {
      const response = await fetch(`/api/video-reviews/comments/${commentId}/resolve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ resolved }),
      });
      if (response.ok) {
        toast.success(resolved ? "Comentário resolvido!" : "Comentário reaberto!");
        if (selectedReview) loadReviewDetails(selectedReview.id);
      }
    } catch {
      toast.error("Erro ao atualizar comentário");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Tem certeza que deseja excluir este comentário?")) return;
    try {
      const response = await fetch(`/api/video-reviews/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        toast.success("Comentário excluído!");
        if (selectedReview) loadReviewDetails(selectedReview.id);
      }
    } catch {
      toast.error("Erro ao excluir comentário");
    }
  };

  const handleTimestampClick = (seconds: number) => {
    setSeekTo(seconds);
  };

  const handlePlayerProgress = (seconds: number) => {
    setNewCommentTimestamp(Math.floor(seconds));
  };

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const videoFiles = projectFiles.filter(
    (file) => file.mime_type?.startsWith("video/") || file.original_name.match(/\.(mp4|mov|avi|mkv|webm)$/i)
  );

  if (!projectId) {
    return (
      <div className="min-h-screen bg-frame-black text-frame-white font-frame-body flex flex-col">
        <AppNavBar />
        <ProjectGateway
          eyebrow="// Reviews"
          title="REVIEWS"
          description="Escolha ou crie um projeto para revisar vídeos, gerar links compartilháveis e concentrar comentários por timestamp."
          actionLabel="Criar e abrir reviews"
          routeBase="video-reviews"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-frame-black text-frame-white font-frame-body flex flex-col">
      <AppNavBar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl w-full mx-auto px-6 py-10"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-frame-white mb-2">Reviews de Vídeo</h1>
            <p className="text-frame-gray-light">Gerencie reviews e comentários de vídeos do projeto</p>
          </div>
          <button
            onClick={() => {
              loadProjectFiles();
              setShowCreateModal(true);
            }}
            className="frame-btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Novo Review
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-frame-orange" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-frame-gray-1 rounded-lg border border-frame-gray-3">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-frame-gray-4" />
            <h3 className="text-xl font-semibold text-frame-white mb-2">Nenhum review encontrado</h3>
            <p className="text-frame-gray-light mb-4">Crie seu primeiro review para começar</p>
            <button
              onClick={() => {
                loadProjectFiles();
                setShowCreateModal(true);
              }}
              className="frame-btn-primary"
            >
              Criar Review
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Review List */}
            <div className="lg:col-span-1 space-y-4">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => loadReviewDetails(review.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition ${
                    selectedReview?.id === review.id
                      ? "bg-frame-orange/10 border-frame-orange"
                      : "bg-frame-gray-1 border-frame-gray-3 hover:border-frame-gray-4"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded bg-frame-gray-3 flex items-center justify-center shrink-0">
                      <Film className="w-5 h-5 text-frame-orange" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-frame-white truncate">{review.title}</h3>
                      <p className="text-sm text-frame-gray-light truncate">{review.original_name || review.description || "Vídeo externo"}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-frame-gray-4">
                        <Clock className="w-3 h-3" />
                        {new Date(review.created_at).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Review Detail */}
            <div className="lg:col-span-2">
              {selectedReview ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="bg-frame-gray-1 rounded-lg border border-frame-gray-3 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-frame-white mb-2">{selectedReview.title}</h2>
                        {selectedReview.description && (
                          <p className="text-frame-gray-light">{selectedReview.description}</p>
                        )}
                      </div>
                      <button
                        onClick={handleGenerateShareLink}
                        className="frame-btn-ghost flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Compartilhar
                      </button>
                    </div>

                    {/* Video Player */}
                    <VideoPlayer
                      url={resolveVideoUrl(selectedReview)}
                      onProgress={handlePlayerProgress}
                      onReady={() => setPlayerReady(true)}
                      seekTo={seekTo}
                    />
                  </div>

                  {/* Comments Section */}
                  <div className="bg-frame-gray-1 rounded-lg border border-frame-gray-3 p-6">
                    <h3 className="text-xl font-bold text-frame-white mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Comentários ({comments.length})
                    </h3>

                    <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                      {comments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 border-l-2 ${
                            comment.resolved
                              ? "border-frame-gray-4 bg-frame-gray-2/50 opacity-60"
                              : "border-frame-orange bg-frame-gray-1"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-frame-orange flex items-center justify-center text-frame-black font-bold text-sm">
                                {comment.author_name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-frame-white text-sm">{comment.author_name}</p>
                                <button
                                  onClick={() => handleTimestampClick(comment.timestamp_seconds)}
                                  className="text-xs text-frame-orange hover:underline font-mono flex items-center gap-1"
                                >
                                  <Clock className="w-3 h-3" />
                                  {formatTimestamp(comment.timestamp_seconds)}
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleResolveComment(comment.id, !comment.resolved)}
                                className="p-1 hover:bg-frame-gray-3 rounded transition"
                                title={comment.resolved ? "Reabrir" : "Resolver"}
                              >
                                {comment.resolved ? (
                                  <Square className="w-4 h-4 text-frame-gray-4" />
                                ) : (
                                  <CheckSquare className="w-4 h-4 text-frame-green" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="p-1 hover:bg-frame-red/20 rounded transition"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4 text-frame-red" />
                              </button>
                            </div>
                          </div>
                          <p className="text-frame-gray-light text-sm ml-11">{comment.comment}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Add Comment Form */}
                    <div className="border-t border-frame-gray-3 pt-4">
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="Seu comentário..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="frame-input flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment();
                            }
                          }}
                        />
                        <button
                          onClick={handleAddComment}
                          className="frame-btn-primary flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-frame-gray-light/60">
                        <Clock className="w-3 h-3" />
                        <span>Timestamp automático: {newCommentTimestamp !== null ? formatTimestamp(newCommentTimestamp) : "--:--"}</span>
                        <span className="text-frame-gray-4">|</span>
                        <span>Pause o vídeo para marcar o frame exato</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-frame-gray-1 rounded-lg border border-frame-gray-3 p-12 text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-frame-gray-4" />
                  <h3 className="text-xl font-semibold text-frame-white mb-2">Selecione um review</h3>
                  <p className="text-frame-gray-light">Clique em um review da lista para ver os detalhes</p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Create Review Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-frame-gray-1 border border-frame-gray-3 p-6 w-full max-w-lg"
          >
            <h2 className="text-2xl font-bold text-frame-white mb-4">Novo Review</h2>
            <div className="space-y-4">
              {/* Source Selection */}
              <div className="border border-frame-gray-3 bg-frame-black/30 p-4">
                <label className="block text-sm font-medium text-frame-gray-light mb-3 uppercase tracking-wider text-xs">
                  Fonte do Vídeo
                </label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    className={`p-3 border text-center transition ${
                      uploadMode === "file"
                        ? "border-frame-orange bg-frame-orange/10 text-frame-orange"
                        : "border-frame-gray-3 text-frame-gray-light hover:border-frame-gray-4"
                    }`}
                  >
                    <FileVideo className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Arquivo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("drive")}
                    className={`p-3 border text-center transition ${
                      uploadMode === "drive"
                        ? "border-frame-orange bg-frame-orange/10 text-frame-orange"
                        : "border-frame-gray-3 text-frame-gray-light hover:border-frame-gray-4"
                    }`}
                  >
                    <LinkIcon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Google Drive</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode(null)}
                    className={`p-3 border text-center transition ${
                      uploadMode === null && !selectedFileId
                        ? "border-frame-orange bg-frame-orange/10 text-frame-orange"
                        : "border-frame-gray-3 text-frame-gray-light hover:border-frame-gray-4"
                    }`}
                  >
                    <Film className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Projeto</span>
                  </button>
                </div>

                {uploadMode === "file" && (
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-frame-gray-3 p-6 text-center hover:border-frame-orange/50 transition cursor-pointer">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={(e) => setSelectedFileForUpload(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      {selectedFileForUpload ? (
                        <div>
                          <p className="text-sm text-frame-white">{selectedFileForUpload.name}</p>
                          <p className="text-xs text-frame-gray-light mt-1">
                            {(selectedFileForUpload.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            type="button"
                            onClick={() => setSelectedFileForUpload(null)}
                            className="text-xs text-frame-red hover:underline mt-2"
                          >
                            Remover
                          </button>
                        </div>
                      ) : (
                        <div onClick={() => fileInputRef.current?.click()}>
                          <Upload className="w-8 h-8 mx-auto mb-2 text-frame-gray-light" />
                          <p className="text-sm text-frame-gray-light">Clique para selecionar um vídeo</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {uploadMode === "drive" && (
                  <div>
                    <label className="block text-xs text-frame-gray-light mb-2 uppercase tracking-wider">
                      Link do Google Drive
                    </label>
                    <input
                      type="url"
                      value={driveLink}
                      onChange={(e) => setDriveLink(e.target.value)}
                      className="frame-input w-full"
                      placeholder="https://drive.google.com/file/d/..."
                    />
                    <p className="text-xs text-frame-gray-light/60 mt-1">
                      Cole o link de qualquer vídeo do Google Drive (público ou com permissão)
                    </p>
                  </div>
                )}

                {uploadMode === null && (
                  <div>
                    {videoFiles.length > 0 ? (
                      <select
                        value={selectedFileId}
                        onChange={(e) => setSelectedFileId(e.target.value)}
                        className="frame-input w-full"
                      >
                        <option value="">Selecione um vídeo do projeto</option>
                        {videoFiles.map((file) => (
                          <option key={file.id} value={file.id}>
                            {file.original_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-frame-gray-light text-sm">
                        Nenhum vídeo no projeto. Use "Arquivo" ou "Google Drive" acima.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-frame-gray-light mb-2 uppercase tracking-wider text-xs">
                  Título
                </label>
                <input
                  type="text"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  className="frame-input w-full"
                  placeholder="Ex: Review versão 1.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-frame-gray-light mb-2 uppercase tracking-wider text-xs">
                  Descrição (opcional)
                </label>
                <textarea
                  value={newReviewDescription}
                  onChange={(e) => setNewReviewDescription(e.target.value)}
                  className="frame-input w-full h-24"
                  placeholder="Descrição do review..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6 border-t border-frame-gray-3 pt-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetCreateForm();
                }}
                className="frame-btn-ghost flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateReview}
                disabled={isUploading}
                className="frame-btn-primary flex-1"
              >
                {isUploading ? "Enviando..." : "Criar Review"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Share Link Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-frame-gray-1 border border-frame-gray-3 p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold text-frame-white mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Link Compartilhável
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-frame-gray-light mb-2">Link do Review</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="frame-input flex-1"
                  />
                  <button
                    onClick={handleCopyShareLink}
                    className="frame-btn-ghost flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-frame-gray-light">
                <ExternalLink className="w-4 h-4" />
                <p>Este link expira em 7 dias</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6 border-t border-frame-gray-3 pt-4">
              <button
                onClick={() => setShowShareModal(false)}
                className="frame-btn-primary flex-1"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function VideoReviews() {
  return (
    <ProtectedRoute>
      <VideoReviewsContent />
    </ProtectedRoute>
  );
}
