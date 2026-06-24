import { FOOTER_LINKS, SITE_CONFIG } from "@shared/site";
import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";

/**
 * Footer Component
 * Design: Simples e elegante com links organizados em colunas
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] border-t border-[#141414] py-16 px-9 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 pb-12 border-b border-[#0e0e0e]">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <a
              href="/"
              className="font-frame-display text-[2.6rem] tracking-[0.04em] text-frame-white mb-2 inline-block"
            >
              FRAME<span className="text-frame-orange">.</span>AI
            </a>
            <p className="text-frame-gray-light text-[0.8rem] font-light max-w-sm leading-relaxed">
              A agência inteligente do filmmaker moderno. Ferramentas IA para roteiro, callsheet, decupagem, orçamento e muito mais.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-8"
          >
            {Object.entries(FOOTER_LINKS).map(([key, section]: any) => (
              <div key={key}>
                <h4 className="font-frame-mono text-[0.56rem] tracking-[0.2em] uppercase text-frame-orange mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link: any) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-[0.82rem] text-frame-gray-light hover:text-frame-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 font-frame-mono text-[0.58rem] tracking-[0.1em] text-[#333]"
        >
          <div>© {currentYear} FRAME.AI — Todos os direitos reservados.</div>
          <div>Feito por filmmakers, para filmmakers.</div>
        </motion.div>
      </div>
    </footer>
  );
}
