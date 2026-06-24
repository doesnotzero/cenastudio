import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import Navigation from "@/components/landing/Navigation";
import PricingSection from "@/components/landing/PricingSection";
import ToolsSection from "@/components/landing/ToolsSection";
import { CheckoutModal } from "@/components/landing/modals/CheckoutModal";
import { ContactModal } from "@/components/landing/modals/ContactModal";
import { DemoModal } from "@/components/landing/modals/DemoModal";

export default function Landing() {
  return (
    <div className="min-h-screen bg-frame-black text-frame-white overflow-x-hidden">
      <Navigation />
      <Hero />
      <ToolsSection />
      <PricingSection />
      <section id="contact" className="py-20 px-8 md:px-12 border-t border-white/10">
        <div className="max-w-xl">
          <p className="text-[#ff4d00] text-xs tracking-widest mb-2">// CONTATO</p>
          <h2 className="text-3xl font-bold mb-4">Fale com a equipe</h2>
          <p className="text-white/60 text-sm mb-6">
            Use o botão Contato no menu ou envie uma mensagem pelo modal.
          </p>
        </div>
      </section>
      <Footer />
      <ContactModal />
      <CheckoutModal />
      <DemoModal />
    </div>
  );
}
