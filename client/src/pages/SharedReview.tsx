import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Play, MessageSquare, Clock, Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface SharedReview {
  id: number;
  title: string;
  description: string | null;
  original_name: string;
  file_path: string;
  project_name: string;
  expires_at: string | null;
}

interface VideoComment {
  id: number;
  author_name: string;
  timestamp_seconds: number;
  comment: string;
  created_at: string;
}

export default function SharedReview() {
  const { token } = useParams<{ token: string }>();
  const [review, setReview] = useState<SharedReview | null>(null);
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newCommentTimestamp, setNewCommentTimestamp] = useState(0);
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    loadSharedReview();
  }, [token]);

  const loadSharedReview = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/public/video-reviews/shared/${token}`);
      const data = await response.json();
      if (data.success) {
        setReview(data.data);
        setComments(data.data.comments || []);
      } else {
        setError(data.error || "Erro ao carregar review");
      }
    } catch (error) {
      setError("Erro ao carregar review");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !authorName.trim()) {
      toast.error("Nome e comentário são obrigatórios");
      return;
    }

    try {
      const response = await fetch(`/api/public/video-reviews/shared/${token}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestampSeconds: newCommentTimestamp,
          comment: newComment,
          authorName,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Comentário adicionado!");
        setNewComment("");
        setNewCommentTimestamp(0);
        loadSharedReview();
      }
    } catch (error) {
      toast.error("Erro ao adicionar comentário");
    }
  };

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-frame-black flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-frame-orange" />
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="min-h-screen bg-frame-black flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-frame-red" />
          <h2 className="text-2xl font-bold text-frame-white mb-2">Review não encontrado</h2>
          <p className="text-frame-gray-light mb-4">
            {error || "Este link pode ter expirado ou não existe."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-frame-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto p-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-frame-white mb-2">{review.title}</h1>
          {review.description && (
            <p className="text-frame-gray-light mb-4">{review.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-frame-gray-4">
            <span>Projeto: {review.project_name}</span>
            {review.expires_at && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Expira em {new Date(review.expires_at).toLocaleDateString("pt-BR")}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-frame-gray-1 rounded-lg border border-frame-gray-3 p-6">
              <div className="aspect-video bg-frame-black rounded-lg flex items-center justify-center border border-frame-gray-3">
                <div className="text-center">
                  <Play className="w-16 h-16 mx-auto mb-4 text-frame-orange" />
                  <p className="text-frame-gray-light">{review.original_name}</p>
                </div>
              </div>
            </div>

            <div className="bg-frame-gray-1 rounded-lg border border-frame-gray-3 p-6">
              <h3 className="text-xl font-bold text-frame-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Adicionar Comentário
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-frame-gray-light mb-2">Seu Nome</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="frame-input w-full"
                    placeholder="Digite seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-frame-gray-light mb-2">Timestamp (segundos)</label>
                  <input
                    type="number"
                    value={newCommentTimestamp}
                    onChange={(e) => setNewCommentTimestamp(parseFloat(e.target.value) || 0)}
                    className="frame-input w-full"
                    placeholder="Ex: 45"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-frame-gray-light mb-2">Comentário</label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="frame-input w-full h-24"
                    placeholder="Deixe seu feedback aqui..."
                  />
                </div>
                <button
                  onClick={handleAddComment}
                  className="frame-btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Enviar Comentário
                </button>
              </div>
            </div>
          </div>

          <div className="bg-frame-gray-1 rounded-lg border border-frame-gray-3 p-6">
            <h3 className="text-xl font-bold text-frame-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Comentários ({comments.length})
            </h3>

            {comments.length === 0 ? (
              <div className="text-center py-8 text-frame-gray-light">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-frame-gray-4" />
                <p>Nenhum comentário ainda</p>
                <p className="text-sm">Seja o primeiro a deixar um feedback!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-lg border border-frame-gray-3 bg-frame-gray-2"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-frame-orange flex items-center justify-center text-frame-black font-bold flex-shrink-0">
                        {comment.author_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-frame-white">{comment.author_name}</p>
                        <div className="flex items-center gap-2 text-xs text-frame-gray-4">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimestamp(comment.timestamp_seconds)}</span>
                          <span>•</span>
                          <span>{new Date(comment.created_at).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-frame-gray-light">{comment.comment}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
