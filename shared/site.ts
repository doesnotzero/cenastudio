export const SITE_CONFIG = {
  title: "FRAME.AI — Plataforma Inteligente para Produção Audiovisual",
  description:
    "A plataforma completa do filmmaker moderno. IA para roteiro, callsheet, decupagem, orçamento, gestão de arquivos, revisão de vídeos, CRM e pipeline comercial.",
  domain: "frame.ai",
};

export const NAVIGATION = [
  { label: "Ferramentas", href: "#tools" },
  { label: "Sobre", href: "#about" },
  { label: "Preços", href: "#pricing" },
  { label: "Contato", href: "#contact" },
];

export const HERO = {
  tag: "Plataforma Completa de Produção Audiovisual",
  title: ["PRÉ-PRODUÇÃO", "PRODUÇÃO", "PÓS-PRODUÇÃO"],
  subtitle:
    "A plataforma que unifica todo o fluxo de produção audiovisual: roteiros com IA, callsheet inteligente, decupagem técnica, orçamentos automáticos, gestão de arquivos, revisão de vídeos com anotações no frame, CRM de clientes e pipeline comercial. Tudo em um só lugar.",
  cta: {
    primary: { label: "Começar Agora", href: "/login" },
    secondary: { label: "Ver Demonstração", href: "#" },
  },
  stats: [
    { number: "5K+", label: "Projetos Realizados" },
    { number: "50+", label: "Ferramentas e Módulos" },
    { number: "12", label: "Países" },
  ],
};

export type PlanTier = "iniciante" | "profissional" | "produtora";

export const PRICING = [
  {
    id: "iniciante" as PlanTier,
    tier: "// Iniciante",
    price: "R$97",
    period: "/mês",
    description: "Para freelancers e criadores independentes",
    features: [
      "15 gerações com IA/mês",
      "Callsheet, roteiro e decupagem",
      "10 arquivos em nuvem",
      "3 projetos simultâneos",
      "CRM básico de clientes",
      "Suporte por email",
    ],
    cta: { label: "Começar Grátis", href: "#" },
    highlight: false,
  },
  {
    id: "profissional" as PlanTier,
    tier: "// Profissional",
    price: "R$297",
    period: "/mês — mais popular",
    description: "Para produtoras e profissionais",
    features: [
      "Gerações ilimitadas com IA",
      "Todas as ferramentas do estúdio",
      "Arquivos ilimitados em nuvem",
      "Projetos ilimitados",
      "Review de vídeos com anotações",
      "CRM completo + pipeline",
      "Suporte prioritário",
    ],
    cta: { label: "Assinar Pro", href: "#" },
    highlight: true,
  },
  {
    id: "produtora" as PlanTier,
    tier: "// Produtora",
    price: "R$697",
    period: "/mês",
    description: "Para grandes produtoras e agências",
    features: [
      "Tudo do Profissional",
      "Multi-usuários (10 seats)",
      "API de integração",
      "White-label",
      "Onboarding dedicado",
      "SLA garantido",
      "Relatórios avançados",
    ],
    cta: { label: "Falar com equipe", href: "#" },
    highlight: false,
  },
];

export const MARQUEE_ITEMS = [
  "PRÉ-PRODUÇÃO",
  "ROTEIRO IA",
  "CALLSHEET",
  "DECUPAGEM",
  "ORÇAMENTO",
  "CONTRATO",
  "PROPOSTA",
  "BRIEFING",
  "MOODBOARD",
  "CHECKLIST",
  "CRONOGRAMA",
  "ENTREGA",
  "ARQUIVOS",
  "REVIEW DE VÍDEO",
  "CRM",
  "PIPELINE",
  "ANALYTICS",
];

export const FOOTER_LINKS = {
  tools: {
    title: "Plataforma",
    links: [
      { label: "Estúdio IA", href: "#tools" },
      { label: "Arquivos", href: "#tools" },
      { label: "Review de Vídeo", href: "#tools" },
      { label: "CRM", href: "#tools" },
      { label: "Pipeline", href: "#tools" },
      { label: "Analytics", href: "#tools" },
    ],
  },
  company: {
    title: "Empresa",
    links: [
      { label: "Sobre", href: "#about" },
      { label: "Contato", href: "#contact" },
      { label: "Preços", href: "#pricing" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Termos", href: "#" },
      { label: "Privacidade", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
};
