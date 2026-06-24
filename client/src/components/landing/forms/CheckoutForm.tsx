/**
 * Checkout Form Component
 * Formulário para processamento de pagamento
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckoutFormData } from "@/lib/types";
import { useApp } from "@/contexts/AppContext";
import { ApiError, startCheckout } from "@/lib/api";
import { toStripePlanId } from "@/lib/plans";
import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
  onSuccess?: () => void;
}

export function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const { isLoading, selectedPlan } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [paymentsUnavailable, setPaymentsUnavailable] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CheckoutFormData>({
    defaultValues: {
      planId: selectedPlan || "profissional",
    },
  });

  useEffect(() => {
    if (selectedPlan) setValue("planId", selectedPlan);
  }, [selectedPlan, setValue]);

  const onSubmit = async (data: CheckoutFormData) => {
    const stripePlan = toStripePlanId(data.planId);
    if (!stripePlan) {
      setPaymentsUnavailable(false);
      return;
    }

    setSubmitting(true);
    setPaymentsUnavailable(false);
    try {
      await startCheckout(stripePlan);
      onSuccess?.();
    } catch (error) {
      if (error instanceof ApiError && error.status === 503) {
        setPaymentsUnavailable(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const loading = isLoading || submitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register("planId", { required: true })} />
      {paymentsUnavailable && (
        <p className="text-sm text-amber-400 bg-amber-950/40 border border-amber-900 px-3 py-2">
          Pagamentos temporariamente indisponíveis.
        </p>
      )}
      {/* Plan Selection */}
      <div className="bg-frame-gray-1 p-4 border border-frame-gray-3">
        <p className="font-frame-mono text-[0.56rem] tracking-[0.15em] uppercase text-frame-gray-light mb-2">
          Plano selecionado
        </p>
        <p className="frame-title text-2xl text-frame-orange">
          {selectedPlan?.toUpperCase() || "PROFISSIONAL"}
        </p>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="font-frame-mono text-[0.6rem] tracking-[0.15em] uppercase text-frame-orange">
          Informações pessoais
        </h3>

        <div>
          <Label htmlFor="fullName" className="font-frame-mono text-[0.56rem] tracking-[0.15em] uppercase text-frame-gray-light">
            Nome Completo *
          </Label>
          <Input
            id="fullName"
            placeholder="Seu nome completo"
            {...register("fullName", { required: "Nome é obrigatório" })}
            className="mt-1 frame-input"
            disabled={loading}
          />
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="font-frame-mono text-[0.56rem] tracking-[0.15em] uppercase text-frame-gray-light">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            {...register("email", {
              required: "Email é obrigatório",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido",
              },
            })}
            className="mt-1 frame-input"
            disabled={loading}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone" className="font-frame-mono text-[0.56rem] tracking-[0.15em] uppercase text-frame-gray-light">
              Telefone *
            </Label>
            <Input
              id="phone"
              placeholder="(11) 99999-9999"
              {...register("phone", { required: "Telefone é obrigatório" })}
              className="mt-1 frame-input"
              disabled={loading}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <Label htmlFor="company" className="font-frame-mono text-[0.56rem] tracking-[0.15em] uppercase text-frame-gray-light">
              Empresa
            </Label>
            <Input
              id="company"
              placeholder="Sua empresa"
              {...register("company")}
              className="mt-1 frame-input"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className="space-y-4">
        <h3 className="font-frame-mono text-[0.6rem] tracking-[0.15em] uppercase text-frame-orange">
          Endereço de cobrança
        </h3>

        <div>
          <Label htmlFor="billingAddress" className="font-frame-mono text-[0.56rem] tracking-[0.15em] uppercase text-frame-gray-light">
            Endereço *
          </Label>
          <Input
            id="billingAddress"
            placeholder="Rua, número"
            {...register("billingAddress", { required: "Endereço é obrigatório" })}
            className="mt-1 frame-input"
            disabled={loading}
          />
          {errors.billingAddress && (
            <p className="text-xs text-red-500 mt-1">{errors.billingAddress.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="billingCity" className="font-frame-mono text-[0.56rem] tracking-[0.15em] uppercase text-frame-gray-light">
              Cidade *
            </Label>
            <Input
              id="billingCity"
              placeholder="São Paulo"
              {...register("billingCity", { required: "Cidade é obrigatória" })}
              className="mt-1 frame-input"
              disabled={loading}
            />
            {errors.billingCity && <p className="text-xs text-red-500 mt-1">{errors.billingCity.message}</p>}
          </div>

          <div>
            <Label htmlFor="billingState" className="font-frame-mono text-[0.56rem] tracking-[0.15em] uppercase text-frame-gray-light">
              Estado *
            </Label>
            <Input
              id="billingState"
              placeholder="SP"
              maxLength={2}
              {...register("billingState", { required: "Estado é obrigatório" })}
              className="mt-1 frame-input"
              disabled={loading}
            />
            {errors.billingState && <p className="text-xs text-red-500 mt-1">{errors.billingState.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="billingZip" className="font-frame-mono text-[0.56rem] tracking-[0.15em] uppercase text-frame-gray-light">
            CEP *
          </Label>
          <Input
            id="billingZip"
            placeholder="01234-567"
            {...register("billingZip", { required: "CEP é obrigatório" })}
            className="mt-1 frame-input"
            disabled={loading}
          />
          {errors.billingZip && <p className="text-xs text-red-500 mt-1">{errors.billingZip.message}</p>}
        </div>
      </div>

      {/* Payment Information */}
      <div className="space-y-4">
        <h3 className="font-frame-mono text-[0.6rem] tracking-[0.15em] uppercase text-frame-orange">
          Informações de pagamento
        </h3>

        <div>
          <Label htmlFor="cardNumber" className="font-frame-mono text-[0.56rem] tracking-[0.15em] uppercase text-frame-gray-light">
            Número do Cartão *
          </Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            {...register("cardNumber", {
              required: "Número do cartão é obrigatório",
              minLength: { value: 16, message: "Número do cartão inválido" },
            })}
            className="mt-1 frame-input font-frame-mono"
            disabled={loading}
            maxLength={19}
          />
          {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cardExpiry" className="font-frame-mono text-[0.56rem] tracking-[0.15em] uppercase text-frame-gray-light">
              Validade *
            </Label>
            <Input
              id="cardExpiry"
              placeholder="MM/YY"
              {...register("cardExpiry", {
                required: "Validade é obrigatória",
                pattern: { value: /^\d{2}\/\d{2}$/, message: "Formato: MM/YY" },
              })}
              className="mt-1 frame-input font-frame-mono"
              disabled={loading}
              maxLength={5}
            />
            {errors.cardExpiry && <p className="text-xs text-red-500 mt-1">{errors.cardExpiry.message}</p>}
          </div>

          <div>
            <Label htmlFor="cardCVC" className="font-frame-mono text-[0.56rem] tracking-[0.15em] uppercase text-frame-gray-light">
              CVC *
            </Label>
            <Input
              id="cardCVC"
              placeholder="123"
              {...register("cardCVC", {
                required: "CVC é obrigatório",
                minLength: { value: 3, message: "CVC inválido" },
              })}
              className="mt-1 frame-input font-frame-mono"
              disabled={loading}
              maxLength={4}
            />
            {errors.cardCVC && <p className="text-xs text-red-500 mt-1">{errors.cardCVC.message}</p>}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-frame-orange hover:bg-frame-orange-dark text-frame-black font-semibold py-3"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processando...
          </>
        ) : (
          "Confirmar Pagamento"
        )}
      </Button>

      {/* Security Note */}
      <p className="text-xs text-frame-gray-muted text-center font-light">
        Seus dados são processados de forma segura. Nunca compartilhamos informações de pagamento.
      </p>
    </form>
  );
}
