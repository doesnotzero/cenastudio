import { useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import AppNavBar from "@/components/AppNavBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import VideoPlayer from "@/components/VideoPlayer";
import type { Annotation } from "@/components/AnnotationCanvas";
import {
  Plus, Share2, MessageSquare, Clock,
  Trash2, Copy, ExternalLink,
  Film, CheckSquare, Square, Send, PenLine,
  ChevronRight, Video,
} from "lucide-react";
import { toast } from "sonner";

function parseGoogleDriveLink(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  // Already a direct video URL (mp4, webm, etc.) — use as-is
  if (/\.(mp4|webm|mov|avi|mkv|ogg)(\?|$)/i.test(trimmed)) return trimmed;
  // Google Drive share links
  const patterns = [
    /(?:drive\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)/,
    /(?:drive\.google\.com\/open\?id=)([a-zA-Z0-9_-]+)/,
    /(?:drive\.google\.com\/uc\?(?:export=download&)?id=)([a-zA-Z0-9_-]+)/,
    /(?:docs\.google\.com\/uc\?(?:export=download&)?id=)([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  // YouTube — let react-player handle it
  if (/youtube\.com|youtu\.be/i.test(trimmed)) return trimmed;
  // Vimeo — let react-player handle it
  if (/vimeo\.com/i.test(trimmed)) return trimmed;
  // Anything else — use raw URL, react-player will try its best
  return trimmed;
}

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
  annotations: Annotation[];
  resolved: number;
  created_at: string;
}

interface ProjectFile {
  id: number;
  original_name: string;
  mime_type: string | null;
  size: number | null;
}

const REVIEW_STATUSES = [
  { value: "draft", label: "Rascunho", color: "text-frame-gray-light border-frame-gray-3" },
  { value: "pending_review", label: "Pendente", color: "text-yellow-400 border-yellow-500/30" },
  { value: "changes_requested", label: "Alterações", color: "text-orange-400 border-orange-500/30" },
  { value: "approved", label: "Aprovado", color: "text-green-400 border-green-500/30" },
  { value: "rejected", label: "Rejeitado", color: "text-red-400 border-red-500/30" },
];

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
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadAllReviews();
  }, []);

  useEffect(() => {
    if (projectId) {
      loadProjectFiles();
    }
  }, [projectId]);

  const loadAllReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/video-reviews", { credentials: "include" });
      const data = await response.json();
      if (data.success) setReviews(data.data);
    } catch {
      toast.error("Erro ao carregar reviews");
    } finally {
      setLoading(false);
    }
  };

  const loadProjectFiles = async () => {
    if (!projectId) return;
    try {
      const response = await fetch(`/api/files/projects/${projectId}`, { credentials: "include" });
      const data = await response.json();
      if (data.success) setProjectFiles(data.data);
    } catch {
      toast.error("Erro ao carregar arquivos do projeto");
    }
  };

  const ensureDefaultProject = async (): Promise<number> => {
    if (projectId) return parseInt(projectId);
    const response = await fetch("/api/projects", { credentials: "include" });
    const data = await response.json();
    if (data.success) {
      const existing = data.data.find(
        (p: any) => p.name === "Aprovação de Vídeo" || p.name === "Video Reviews"
      );
      if (existing) return existing.id;
    }
    const createRes = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: "Aprovação de Vídeo", description: "Projeto para aprovação de vídeos" }),
    });
    const createData = await createRes.json();
    if (createData.success) return createData.data.id;
    throw new Error("Erro ao criar projeto padrão");
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
      const response = await fetch(`/api/video-reviews/${reviewId}`, { credentials: "include" });
      const data = await response.json();
      if (data.success) {
        setSelectedReview(data.data);
        setComments(data.data.comments || []);
        setSeekTo(null);
      }
    } catch {
      toast.error("Erro ao carregar detalhes do review");
    }
  };

  const handleCreateReview = async () => {
    if (!newReviewTitle.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    const rawLink = driveLink.trim();
    if (!selectedFileId && !rawLink) {
      toast.error("Cole um link do Google Drive ou selecione um vídeo do projeto");
      return;
    }

    setIsUploading(true);
    try {
      let fileId = selectedFileId ? parseInt(selectedFileId) : null;
      const videoUrl = rawLink ? parseGoogleDriveLink(rawLink) || rawLink : "";
      const activeProjectId: number | null = projectId ? parseInt(projectId) : null;
      await submitReview(fileId, videoUrl, activeProjectId);
    } catch {
      toast.error("Erro ao criar review");
    } finally {
      setIsUploading(false);
    }
  };

  const submitReview = async (fileId: number | null, videoUrl: string, activeProjectId: number | null) => {
    const response = await fetch("/api/video-reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        projectId: activeProjectId,
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
      loadAllReviews();
    } else {
      toast.error(data.error || "Erro ao criar review");
    }
  };

  const resetCreateForm = () => {
    setNewReviewTitle("");
    setNewReviewDescription("");
    setSelectedFileId("");
    setDriveLink("");
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

  const handleAddAnnotatedComment = async (annotations: Annotation[], timestamp: number) => {
    if (!selectedReview) return;
    try {
      const response = await fetch(`/api/video-reviews/${selectedReview.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          timestampSeconds: timestamp,
          comment: newComment || "Feedback no frame",
          authorName: "Você",
          annotations,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Feedback enviado!");
        setNewComment("");
        loadReviewDetails(selectedReview.id);
      }
    } catch {
      toast.error("Erro ao adicionar feedback");
    }
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

  const handleUpdateReviewStatus = async (status: string) => {
    if (!selectedReview) return;
    try {
      const response = await fetch(`/api/video-reviews/${selectedReview.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Status atualizado!");
        setSelectedReview(data.data);
        loadAllReviews();
      }
    } catch {
      toast.error("Erro ao atualizar status");
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

  const commentMarkers = comments.map((c) => ({
    id: c.id,
    timestampSeconds: c.timestamp_seconds,
    comment: c.comment,
    resolved: !!c.resolved,
    authorName: c.author_name,
  }));

  const currentStatus = selectedReview
    ? REVIEW_STATUSES.find((s) => s.value === selectedReview.status) || REVIEW_STATUSES[0]
    : null;

  return (
    <div className="min-h-screen bg-frame-black text-frame-white font-frame-body flex flex-col">
      <AppNavBar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl w-full mx-auto px-6 py-10 flex-1 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="frame-label mb-2">// APROVAÇÃO DE VÍDEO</p>
            <h1 className="frame-title text-[clamp(2.1rem,4vw,3.5rem)]">
              REVIEWS
            </h1>
            <p className="text-frame-gray-light text-sm mt-2">
              {currentStatus && selectedReview && (
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-frame-mono border ${currentStatus.color} mr-2`}>
                  {currentStatus.label}
                </span>
              )}
              {selectedReview?.title || `${reviews.length} review${reviews.length !== 1 ? "s" : ""} cadastrado${reviews.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedReview && (
              <>
                <div className="flex border border-frame-gray-3">
                  {REVIEW_STATUSES.filter((s) => s.value !== "draft").map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleUpdateReviewStatus(s.value)}
                      className={`px-2.5 py-1.5 text-[0.6rem] font-frame-mono uppercase tracking-wider transition ${
                        selectedReview.status === s.value
                          ? s.color.split(" ")[0] + " bg-frame-gray-3"
                          : "text-frame-gray-light hover:text-frame-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleGenerateShareLink}
                  className="frame-btn-ghost flex items-center gap-1.5 text-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Compartilhar
                </button>
              </>
            )}
            <button
              onClick={() => { loadProjectFiles(); setShowCreateModal(true); }}
              className="frame-btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Review
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-frame-orange" />
          </div>
        ) : reviews.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <Video className="w-16 h-16 mx-auto mb-4 text-frame-gray-light" />
              <h3 className="text-xl font-bold text-frame-white mb-2">Nenhum review ainda</h3>
              <p className="text-frame-gray-light text-sm mb-6">
                Crie um review para aprovar vídeos com anotações no frame, comentários com timestamp e status de aprovação.
              </p>
              <button
                onClick={() => { loadProjectFiles(); setShowCreateModal(true); }}
                className="frame-btn-primary"
              >
                Criar Primeiro Review
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex gap-6 min-h-0">
            {/* Sidebar: Review List */}
            <aside className="w-72 shrink-0 overflow-y-auto space-y-2 pr-2 border-r border-frame-gray-3">
              <p className="text-xs text-frame-gray-light font-frame-mono uppercase tracking-wider mb-3">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
              <AnimatePresence>
                {reviews.map((review) => {
                  const statusInfo = REVIEW_STATUSES.find((s) => s.value === review.status) || REVIEW_STATUSES[0];
                  return (
                    <motion.div
                      key={review.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => loadReviewDetails(review.id)}
                      className={`p-3 border cursor-pointer transition ${
                        selectedReview?.id === review.id
                          ? "bg-frame-orange/10 border-frame-orange"
                          : "bg-frame-gray-1/20 border-frame-gray-3 hover:border-frame-gray-4"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-frame-gray-3 flex items-center justify-center shrink-0">
                          <Film className="w-4 h-4 text-frame-orange" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-frame-white text-sm truncate">{review.title}</h3>
                            <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${
                              statusInfo.value === "approved" ? "bg-green-400" :
                              statusInfo.value === "rejected" ? "bg-red-400" :
                              statusInfo.value === "changes_requested" ? "bg-orange-400" :
                              statusInfo.value === "pending_review" ? "bg-yellow-400" :
                              "bg-frame-gray-4"
                            }`} />
                          </div>
                          <p className="text-xs text-frame-gray-light truncate">{review.original_name || review.description || "Vídeo externo"}</p>
                          <div className="flex items-center gap-2 mt-1.5 text-[0.6rem] text-frame-gray-4 font-frame-mono">
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(review.created_at).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 text-frame-gray-light mt-1 transition ${
                          selectedReview?.id === review.id ? "opacity-100" : "opacity-0"
                        }`} />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </aside>

            {/* Main: Player + Comments */}
            <main className="flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto">
              {selectedReview ? (
                <>
                  <div className="bg-frame-gray-1/20 border border-frame-gray-3 p-4">
                    <VideoPlayer
                      url={resolveVideoUrl(selectedReview)}
                      onProgress={handlePlayerProgress}
                      seekTo={seekTo}
                      commentMarkers={commentMarkers}
                      onAddAnnotatedComment={handleAddAnnotatedComment}
                    />
                    <div className="flex items-center gap-3 mt-3 text-[0.6rem] text-frame-gray-light/60 font-frame-mono flex-wrap">
                      <span>J/K/L — navegar</span>
                      <span>M — mudo</span>
                      <span>F — tela cheia</span>
                      <span>← → — 5s</span>
                      <span>Pause para anotar o frame</span>
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="bg-frame-gray-1/20 border border-frame-gray-3 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-frame-white flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Comentários ({comments.length})
                      </h3>
                    </div>

                    <div className="space-y-3 mb-4 max-h-[50vh] overflow-y-auto">
                      <AnimatePresence>
                        {comments.map((comment) => (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-3 border-l-2 ${
                              comment.resolved
                                ? "border-frame-gray-4 bg-frame-gray-2/30 opacity-60"
                                : "border-frame-orange bg-frame-gray-1/10"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-7 h-7 rounded-full bg-frame-orange flex items-center justify-center text-frame-black font-bold text-xs shrink-0">
                                  {comment.author_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-frame-white text-xs">{comment.author_name}</p>
                                  <button
                                    onClick={() => handleTimestampClick(comment.timestamp_seconds)}
                                    className="text-[0.6rem] text-frame-orange hover:underline font-mono flex items-center gap-1"
                                  >
                                    <Clock className="w-2.5 h-2.5" />
                                    {formatTimestamp(comment.timestamp_seconds)}
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => handleResolveComment(comment.id, !comment.resolved)}
                                  className="p-1 hover:bg-frame-gray-3 transition"
                                  title={comment.resolved ? "Reabrir" : "Resolver"}
                                >
                                  {comment.resolved ? (
                                    <Square className="w-3.5 h-3.5 text-frame-gray-4" />
                                  ) : (
                                    <CheckSquare className="w-3.5 h-3.5 text-frame-green" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="p-1 hover:bg-frame-red/20 transition"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-frame-red" />
                                </button>
                              </div>
                            </div>
                            <p className="text-frame-gray-light text-xs ml-9">{comment.comment}</p>
                            {comment.annotations && comment.annotations.length > 0 && (
                              <div className="ml-9 mt-2 flex items-center gap-1 text-[0.6rem] text-frame-gray-light/60">
                                <PenLine className="w-2.5 h-2.5" />
                                <span>{comment.annotations.length} anotação{comment.annotations.length > 1 ? "ões" : ""} no frame</span>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {comments.length === 0 && (
                        <p className="text-frame-gray-light text-sm text-center py-4">
                          Nenhum comentário ainda. Adicione o primeiro abaixo.
                        </p>
                      )}
                    </div>

                    <div className="border-t border-frame-gray-3 pt-4">
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Comentário (ou pause o vídeo para anotar o frame)..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="flex-1 bg-frame-gray-2 border border-frame-gray-3 px-3 py-2 text-sm outline-none focus:border-frame-orange"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment();
                            }
                          }}
                        />
                        <button
                          onClick={handleAddComment}
                          className="frame-btn-primary flex items-center gap-2 text-sm"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-[0.6rem] text-frame-gray-light/60">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Timestamp: {newCommentTimestamp !== null ? formatTimestamp(newCommentTimestamp) : "--:--"}</span>
                        <span className="opacity-40">|</span>
                        <span className="flex items-center gap-1">
                          <PenLine className="w-2.5 h-2.5" />
                          Pause o vídeo para desenhar anotações no frame
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center border border-dashed border-frame-gray-3">
                  <div className="text-center p-12">
                    <Film className="w-16 h-16 mx-auto mb-4 text-frame-gray-light" />
                    <h3 className="text-xl font-bold text-frame-white mb-2">Selecione um review</h3>
                    <p className="text-frame-gray-light text-sm">
                      Clique em um review da lista ao lado para ver o player, comentários e opções de aprovação.
                    </p>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </motion.div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-frame-gray-1 border border-frame-gray-3 p-6 w-full max-w-lg"
          >
            <h2 className="text-2xl font-bold text-frame-white mb-4">Novo Review</h2>
            <div className="space-y-4">
              <div className="border border-frame-gray-3 bg-frame-black/30 p-4">
                <label className="block text-sm font-medium text-frame-gray-light mb-3 uppercase tracking-wider text-xs">
                  Link do Vídeo
                </label>
                <input
                  type="url"
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                  className="frame-input w-full"
                  placeholder="https://drive.google.com/file/d/..."
                />
                <p className="text-xs text-frame-gray-light/60 mt-2">
                  Google Drive, YouTube, Vimeo ou URL direta de vídeo
                </p>

                <div className="mt-4 pt-4 border-t border-frame-gray-3">
                  <label className="block text-xs text-frame-gray-light mb-2 uppercase tracking-wider">
                    Ou selecione um vídeo já enviado ao projeto
                  </label>
                  {videoFiles.length > 0 ? (
                    <select
                      value={selectedFileId}
                      onChange={(e) => setSelectedFileId(e.target.value)}
                      className="frame-input w-full"
                    >
                      <option value="">Nenhum</option>
                      {videoFiles.map((file) => (
                        <option key={file.id} value={file.id}>
                          {file.original_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-frame-gray-light text-xs italic">
                      Nenhum vídeo no projeto ainda
                    </p>
                  )}
                </div>
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
                onClick={() => { setShowCreateModal(false); resetCreateForm(); }}
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