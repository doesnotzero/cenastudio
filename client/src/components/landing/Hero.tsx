import { HERO } from "@shared/site";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

/**
 * Hero Section Component
 * Design: Cinematográfico com efeito de reel de filme, gradiente radial
 * Animações: Fade-in sequencial, hover effects nos botões
 * Tipografia: Bebas Neue para títulos (display), DM Sans para corpo
 */
export default function Hero() {
  const { openModal } = useApp();
  const [, setLocation] = useLocation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-end pb-20 pt-32 px-9 md:px-12 overflow-hidden">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 60% 40%, #1a0a00 0%, #080808 70%)",
        }}
      />

      {/* Film Reel Background */}
      <div className="absolute top-0 right-0 w-2/3 h-full -z-5 overflow-hidden" style={{ clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)" }}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,77,0,0.03) 3px, rgba(255,77,0,0.03) 4px)",
          }}
        />
        <div className="absolute inset-0 flex flex-wrap gap-0.5 p-0.5 opacity-15">
          {Array.from({ length: 60 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1/5 h-20 bg-gradient-to-br from-[#222] to-[#111] border border-[#2a2a2a] rounded-sm"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{
                duration: 3,
                delay: (i % 20) * 0.15,
                repeat: Infinity as any,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-2xl"
      >
        {/* Tag */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 mb-6"
        >
          <span className="font-frame-mono text-[0.65rem] tracking-[0.2em] uppercase text-frame-orange animate-pulse">
            ▶
          </span>
          <span className="font-frame-mono text-[0.65rem] tracking-[0.2em] uppercase text-frame-orange">
            {(HERO as any).tag}
          </span>
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1
            className="frame-title text-[clamp(4rem,9.5vw,8.5rem)] leading-[0.9] tracking-[0.02em]"
          >
            {(HERO as any).title[0]}
            <br />
            <span className="text-frame-orange ml-16">{(HERO as any).title[1]}</span>
            <br />
            <span
              className="text-transparent"
              style={{
                WebkitTextStroke: "2px #f5f0e8",
              }}
            >
              {(HERO as any).title[2]}
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-[0.93rem] leading-relaxed text-frame-gray-light mb-12 max-w-xl font-light"
        >
          {(HERO as any).subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex gap-4 items-center flex-wrap">
          <motion.button
            onClick={() => setLocation("/login")}
            className="frame-btn-primary"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {(HERO as any).cta.primary.label}
          </motion.button>

          <motion.button
            onClick={() => openModal("demo")}
            className="frame-btn-ghost flex items-center gap-2"
            whileHover={{ x: 4 }}
          >
            {(HERO as any).cta.secondary.label}
            <ChevronRight size={16} />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={itemVariants}
        className="absolute bottom-20 right-9 md:right-12 flex gap-12"
      >
        {HERO.stats.map((stat: any) => (
          <div key={stat.label} className="text-right">
            <div
              className="frame-title text-[2.3rem] text-frame-orange leading-none mb-1"
            >
              {stat.number}
            </div>
            <div className="font-frame-mono text-[0.56rem] tracking-[0.15em] uppercase text-frame-gray-light">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
