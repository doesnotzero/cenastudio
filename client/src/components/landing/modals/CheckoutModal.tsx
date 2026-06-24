/**
 * Checkout Modal Component
 * Modal para formulário de checkout/pagamento
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckoutForm } from "@/components/landing/forms/CheckoutForm";
import { useApp } from "@/contexts/AppContext";

export function CheckoutModal() {
  const { modals, closeModal } = useApp();
  const isOpen = modals.checkout;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal("checkout")}>
      <DialogContent className="sm:max-w-2xl bg-frame-gray-2 border border-frame-gray-3 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="frame-title text-2xl text-frame-white">Finalizar compra</DialogTitle>
          <DialogDescription className="text-frame-gray-light font-light">
            Preencha os dados abaixo para completar sua compra. Seu pagamento é seguro e criptografado.
          </DialogDescription>
        </DialogHeader>
        <CheckoutForm onSuccess={() => closeModal("checkout")} />
      </DialogContent>
    </Dialog>
  );
}
