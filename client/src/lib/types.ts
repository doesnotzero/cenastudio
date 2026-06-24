import type { PlanTier } from "@shared/site";

export type { PlanTier };

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  type: "contact" | "demo" | "support";
}

export interface CheckoutFormData {
  planId: PlanTier;
  fullName: string;
  email: string;
  company?: string;
  phone: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
}

export interface AppContextType {
  isLoading: boolean;
  selectedPlan: PlanTier | null;
  modals: {
    checkout: boolean;
    contact: boolean;
    demo: boolean;
  };
  selectPlan: (plan: PlanTier) => void;
  openModal: (modal: keyof AppContextType["modals"]) => void;
  closeModal: (modal: keyof AppContextType["modals"]) => void;
  submitContact: (data: ContactFormData) => Promise<void>;
  submitCheckout: (data: CheckoutFormData) => Promise<void>;
  submitDemo: (data: { email: string; name: string }) => Promise<void>;
}
