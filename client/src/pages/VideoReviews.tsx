import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Play, Plus, Share2, MessageSquare, Clock, CheckCircle, XCircle, Trash2, Copy, ExternalLink, Upload, Link as LinkIcon, FileVideo } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

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

export default function VideoReviews() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const [reviews, setReviews] = useState<VideoReview[]>([]);
  const [selectedReview, setSelectedReview] = useState<VideoReview | null>(null);
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewDescription, setNewReviewDescription] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newCommentTimestamp, setNewCommentTimestamp] = useState(0);
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadReviews();
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
    } catch (error) {
      toast.error("Erro ao carregar reviews");
    } finally {
      setLoading(false);
    }
  };

  const loadReviewDetails = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/video-reviews/${reviewId}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setSelectedReview(data.data);
        setComments(data.data.comments || []);
      }
    } catch (error) {
      toast.error("Erro ao carregar detalhes do review");
    }
  };

  const handleCreateReview = async () => {
    if (!newReviewTitle.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    try {
      const response = await fetch("/api video-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          projectId: parseInt(projectId!),
          fileId: 1, // TODO: Allow user to select file
          title: newReviewTitle,
          description: newReviewDescription,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Review criado com sucesso!");
        setShowCreateModal(false);
        setNewReviewTitle("");
        setNewReviewDescription("");
        loadReviews();
      }
    } catch (error) {
      toast.error("Erro ao criar review");
    }
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
    } catch (error) {
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
          timestampSeconds: newCommentTimestamp,
          comment: newComment,
          authorName: "Você",
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Comentário adicionado!");
        setNewComment("");
        setNewCommentTimestamp(0);
        loadReviewDetails(selectedReview.id);
      }
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      toast.error("Erro ao excluir comentário");
    }
  };

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-frame-black p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-frame-white mb-2">Reviews de Vídeo</h1>
            <p className="text-frame-gray-light">Gerencie reviews e comentários de vídeos do projeto</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
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
              onClick={() => setShowCreateModal(true)}
              className="frame-btn-primary"
            >
              Criar Review
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <div className="w-10 h-10 rounded bg-frame-gray-3 flex items-center justify-center flex-shrink-0">
                      <Play className="w-5 h-5 text-frame-orange" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-frame-white truncate">{review.title}</h3>
                      <p className="text-sm text-frame-gray-light truncate">{review.original_name}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-frame-gray-4">
                        <Clock className="w-3 h-3" />
                        {new Date(review.created_at).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-2">
              {selectedReview ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
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

                    <div className="aspect-video bg-frame-black rounded-lg flex items-center justify-center border border-frame-gray-3">
                      <div className="text-center">
                        <Play className="w-16 h-16 mx-auto mb-4 text-frame-orange" />
                        <p className="text-frame-gray-light">{selectedReview.original_name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-frame-gray-1 rounded-lg border border-frame-gray-3 p-6">
                    <h3 className="text-xl font-bold text-frame-white mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Comentários ({comments.length})
                    </h3>

                    <div className="space-y-4 mb-6">
                      {comments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 rounded-lg border ${
                            comment.resolved
                              ? "bg-frame-gray-2 border-frame-gray-3 opacity-60"
                              : "bg-frame-gray-1 border-frame-gray-4"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-frame-orange flex items-center justify-center text-frame-black font-bold">
                                {comment.author_name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-frame-white">{comment.author_name}</p>
                                <p className="text-xs text-frame-gray-4">
                                  {formatTimestamp(comment.timestamp_seconds)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleResolveComment(comment.id, !comment.resolved)}
                                className="p-1 hover:bg-frame-gray-3 rounded transition"
                                title={comment.resolved ? "Reabrir" : "Resolver"}
                              >
                                {comment.resolved ? (
                                  <XCircle className="w-4 h-4 text-frame-gray-4" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-frame-green" />
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
                          <p className="text-frame-gray-light">{comment.comment}</p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="border-t border-frame-gray-3 pt-4">
                      <div className="flex gap-4 mb-4">
                        <input
                          type="number"
                          placeholder="Timestamp (segundos)"
                          value={newCommentTimestamp}
                          onChange={(e) => setNewCommentTimestamp(parseFloat(e.target.value) || 0)}
                          className="frame-input w-32"
                        />
                        <input
                          type="text"
                          placeholder="Adicionar comentário..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="frame-input flex-1"
                        />
                        <button
                          onClick={handleAddComment}
                          className="frame-btn-primary"
                        >
                          Enviar
                        </button>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-frame-gray-1 rounded-lg border border-frame-gray-3 p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold text-frame-white mb-4">Novo Review</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-frame-gray-light mb-2">Título</label>
                <input
                  type="text"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  className="frame-input w-full"
                  placeholder="Ex: Review versão 1.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-frame-gray-light mb-2">Descrição (opcional)</label>
                <textarea
                  value={newReviewDescription}
                  onChange={(e) => setNewReviewDescription(e.target.value)}
                  className="frame-input w-full h-24"
                  placeholder="Descrição do review..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="frame-btn-ghost flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateReview}
                className="frame-btn-primary flex-1"
              >
                Criar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Share Link Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-frame-gray-1 rounded-lg border border-frame-gray-3 p-6 w-full max-w-md"
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
                    Copiar
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-frame-gray-light">
                <ExternalLink className="w-4 h-4" />
                <p>Este link expira em 7 dias</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
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
