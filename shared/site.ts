/**
 * Landing / marketing site constants
 */

export const SITE_CONFIG = {
  title: "FRAME.AI — Agência Inteligente para Filmmakers",
  description:
    "A agência inteligente do filmmaker moderno. Ferramentas IA para roteiro, callsheet, decupagem, orçamento e muito mais.",
  domain: "frame.ai",
};

export const NAVIGATION = [
  { label: "Ferramentas", href: "#tools" },
  { label: "Preços", href: "#pricing" },
  { label: "Sobre", href: "#about" },
  { label: "Contato", href: "#contact" },
];

export const HERO = {
  tag: "Inteligência Artificial para Produção",
  title: ["ROTEIROS", "CALLSHEETS", "ORÇAMENTOS"],
  subtitle:
    "Transforme suas ideias em produções profissionais. Gere documentos técnicos, orçamentos realistas e cronogramas em segundos com IA treinada em padrões da indústria cinematográfica.",
  cta: {
    primary: { label: "Começar Agora", href: "/login" },
    secondary: { label: "Ver Demo", href: "#" },
  },
  stats: [
    { number: "2.5K+", label: "Roteiros Gerados" },
    { number: "98%", label: "Satisfação" },
    { number: "47", label: "Países" },
  ],
};

export type PlanTier = "iniciante" | "profissional" | "produtora";

export const PRICING = [
  {
    id: "iniciante" as PlanTier,
    tier: "// Iniciante",
    price: "R$97",
    period: "/mês",
    description: "Perfeito para freelancers e criadores independentes",
    features: [
      "5 roteiros/mês",
      "Callsheet básico",
      "Decupagem simplificada",
      "Orçamento padrão",
      "Suporte por email",
    ],
    cta: { label: "Começar Agora", href: "#" },
    highlight: false,
  },
  {
    id: "profissional" as PlanTier,
    tier: "// Profissional",
    price: "R$297",
    period: "/mês — mais popular",
    description: "Para produtoras e diretores profissionais",
    features: [
      "Roteiros ilimitados",
      "Decupagem técnica IA",
      "Contratos personalizados",
      "Orçamento automático",
      "Gestão de projeto",
      "Suporte prioritário",
    ],
    cta: { label: "Começar Agora", href: "#" },
    highlight: true,
  },
  {
    id: "produtora" as PlanTier,
    tier: "// Produtora",
    price: "R$697",
    period: "/mês",
    description: "Solução completa para grandes produtoras",
    features: [
      "Tudo do Profissional",
      "Multi-usuários (10 seats)",
      "API de integração",
      "White-label",
      "Onboarding dedicado",
      "SLA garantido",
    ],
    cta: { label: "Falar com equipe", href: "#" },
    highlight: false,
  },
];

export const MARQUEE_ITEMS = [
  "PRÉ-PRODUÇÃO",
  "ROTEIRO",
  "CALLSHEET",
  "DECUPAGEM",
  "ORÇAMENTO",
  "CONTRATO",
  "PROPOSTA",
  "COLORIZAÇÃO",
  "ENTREGA",
];

export const FOOTER_LINKS = {
  tools: {
    title: "Ferramentas",
    links: [
      { label: "Gerador de Roteiro", href: "#tools" },
      { label: "Callsheet", href: "#tools" },
      { label: "Decupagem", href: "#tools" },
      { label: "Orçamento", href: "#tools" },
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
