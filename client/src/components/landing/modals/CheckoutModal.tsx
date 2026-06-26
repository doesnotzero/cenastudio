import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useApp } from "@/contexts/AppContext";
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/constants";
import { MessageCircle, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CheckoutModal() {
  const { modals, closeModal, selectedPlan } = useApp();
  const [copied, setCopied] = useState(false);
  const isOpen = modals.checkout;

  const planLabel = selectedPlan === "produtora" ? "Produtora" : "Profissional";
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE(planLabel),
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://wa.me/${WHATSAPP_NUMBER}`);
    setCopied(true);
    toast.success("Número copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal("checkout")}>
      <DialogContent className="sm:max-w-md bg-frame-gray-2 border border-frame-gray-3">
        <DialogHeader>
          <DialogTitle className="frame-title text-2xl text-frame-white">Adquirir plano {planLabel}</DialogTitle>
          <DialogDescription className="text-frame-gray-light font-light">
            Fale diretamente com nosso time comercial para negociar pagamento via PIX ou transferência.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="border border-frame-orange/20 bg-frame-orange/[0.03] p-6 text-center space-y-3">
            <MessageCircle className="w-10 h-10 text-frame-orange mx-auto" />
            <p className="text-sm text-frame-white font-medium">
              Clique no botão abaixo para falar conosco no WhatsApp
            </p>
            <p className="text-xs text-frame-gray-light">
              Respondemos em até 2 horas em dias úteis.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-frame-orange hover:bg-frame-orange/90 text-frame-black font-semibold px-6 py-3 text-sm transition mt-2"
            >
              <MessageCircle className="w-4 h-4" />
              Falar no WhatsApp
            </a>
          </div>

          <div className="flex items-center justify-between border border-frame-gray-3 p-3">
            <span className="text-xs font-frame-mono text-frame-gray-light">{WHATSAPP_NUMBER}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-frame-orange hover:text-frame-white transition p-1"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-xs text-frame-gray-muted text-center font-light">
            Aceitamos PIX, transferência bancária e boleto. Pagamento 100% seguro.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
