/**
 * Single source of truth for all FRAME.AI tools (IDs 01–12).
 * Seeded into SQLite on server startup.
 */

export type ToolId =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12";

export interface ToolDefinition {
  id: ToolId;
  slug: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  tags: string[];
  processingTime: string;
  placeholder: string;
  /** System prompt fragment for Anthropic — built with user input in aiService */
  promptRole: string;
}

export const TOOLS: ToolDefinition[] = [
  {
    id: "01",
    slug: "roteiro",
    name: "Gerador de Roteiro",
    icon: "🎬",
    description:
      "Descreva a ideia e receba um roteiro formatado em padrão ABNT/Hollywood com diálogos, indicações técnicas e timecode.",
    category: "Pré-produção",
    tags: ["Ficção", "Publicidade", "Institucional", "Publicitário"],
    processingTime: "Menos de 2 minutos",
    placeholder:
      "Descreva as diretrizes, contexto, referências ou informações cruciais...\n\nEx: Uma cena de ação em um estádio, paleta teal e orange.",
    promptRole:
      "Você é um roteirista profissional. Gere um roteiro cinematográfico completo em português do Brasil, com cenas numeradas, diálogos, indicações técnicas de câmera, som e duração estimada.",
  },
  {
    id: "02",
    slug: "decupagem",
    name: "Decupagem Técnica",
    icon: "🎞",
    description:
      "Transforme roteiro em plano de filmagem: planos, movimentos de câmera, lentes recomendadas e tempo estimado por cena.",
    category: "Direção",
    tags: ["Direção", "DOP", "Planejamento", "Plano"],
    processingTime: "Menos de 3 minutos",
    placeholder: "Cole o roteiro ou descreva as cenas que deseja decupar...",
    promptRole:
      "Você é diretor de fotografia e assistente de direção. Produza uma decupagem técnica detalhada com tipo de plano, movimento, lente sugerida e tempo estimado por cena.",
  },
  {
    id: "03",
    slug: "callsheet",
    name: "Callsheet Inteligente",
    icon: "📋",
    description:
      "Gere um callsheet profissional com contatos, horários, locações e necessidades técnicas do dia de filmagem.",
    category: "Produção",
    tags: ["Produção", "Logística", "Equipe", "Set"],
    processingTime: "Menos de 1 minuto",
    placeholder: "Nome do projeto, data, local, equipe principal e horários desejados...",
    promptRole:
      "Você é produtor executivo. Gere um callsheet profissional em português com horários, equipe, contatos, locações e notas de segurança.",
  },
  {
    id: "04",
    slug: "orcamento",
    name: "Orçamento Automático",
    icon: "💰",
    description:
      "Monte orçamentos realistas com diárias de equipamento, equipe e pós-produção conforme mercado nacional.",
    category: "Comercial",
    tags: ["Comercial", "Produtora", "Freelance"],
    processingTime: "Menos de 2 minutos",
    placeholder: "Tipo de projeto, duração, equipe, equipamentos e faixa de investimento...",
    promptRole:
      "Você é produtor de orçamento audiovisual no Brasil. Gere um orçamento detalhado com categorias, diárias estimadas em BRL e observações.",
  },
  {
    id: "05",
    slug: "proposta",
    name: "Proposta Comercial",
    icon: "💼",
    description:
      "Gere propostas persuasivas com escopo, cronograma, valor e termos de pagamento para o cliente.",
    category: "Vendas",
    tags: ["Vendas", "Cliente", "Contrato"],
    processingTime: "Menos de 1 minuto",
    placeholder: "Cliente, escopo do projeto, prazo e valor aproximado...",
    promptRole:
      "Você é diretor comercial de produtora. Redija uma proposta comercial profissional em português com escopo, entregáveis, cronograma e condições.",
  },
  {
    id: "06",
    slug: "contrato",
    name: "Contratos",
    icon: "📄",
    description:
      "Contratos de serviço, cessão de imagem, trilha e NDA em linguagem clara. Revise com advogado antes de assinar.",
    category: "Jurídico",
    tags: ["Jurídico", "Proteção"],
    processingTime: "Menos de 2 minutos",
    placeholder: "Tipo de contrato, partes, objeto do serviço e condições principais...",
    promptRole:
      "Você auxilia produtoras com minutas contratuais. Gere um rascunho de contrato de prestação de serviços audiovisuais em português (não substitui advogado).",
  },
  {
    id: "07",
    slug: "briefing",
    name: "Briefing Inteligente",
    icon: "📝",
    description:
      "Extraia e organize todas as informações relevantes do cliente antes de começar a produção.",
    category: "Atendimento",
    tags: ["Discovery", "Atendimento"],
    processingTime: "Menos de 1 minuto",
    placeholder: "Cole a conversa com o cliente, e-mail ou notas soltas...",
    promptRole:
      "Você é estrategista de conteúdo. Transforme as informações em um briefing estruturado: objetivo, público, tom, entregáveis, prazos e riscos.",
  },
  {
    id: "08",
    slug: "moodboard",
    name: "Moodboard & Look",
    icon: "🎨",
    description:
      "Paleta de cores, referências visuais, iluminação, colorização e prompts para geração de imagens.",
    category: "Arte",
    tags: ["Arte", "Look", "Cor"],
    processingTime: "Menos de 2 minutos",
    placeholder: "Conceito visual, referências, gênero e sensação desejada...",
    promptRole:
      "Você é diretor de arte. Descreva um moodboard textual: paleta hex, estilo de luz, composição, referências de cinema e prompts para IA de imagem.",
  },
  {
    id: "09",
    slug: "checklist",
    name: "Checklist de Set",
    icon: "✅",
    description:
      "Lista completa de câmera, áudio, iluminação e produção para não esquecer nada no set.",
    category: "Produção",
    tags: ["Set", "Câmera", "Áudio"],
    processingTime: "Menos de 1 minuto",
    placeholder: "Tipo de produção (estúdio, externa, drone), tamanho da equipe...",
    promptRole:
      "Você é coordenador de produção. Gere um checklist completo de equipamentos e logística para o dia de filmagem.",
  },
  {
    id: "10",
    slug: "cronograma",
    name: "Cronograma",
    icon: "📅",
    description:
      "Planejamento com fases de pré-produção, filmagem, pós-produção e entrega com datas sugeridas.",
    category: "Gestão",
    tags: ["Gestão", "Prazo"],
    processingTime: "Menos de 2 minutos",
    placeholder: "Data de início, data de entrega, complexidade e tamanho da equipe...",
    promptRole:
      "Você é gerente de projetos audiovisuais. Monte um cronograma por fases com marcos, dependências e buffer de risco.",
  },
  {
    id: "11",
    slug: "entrega",
    name: "Relatório de Entrega",
    icon: "📊",
    description:
      "Documente o projeto com especificações técnicas, arquivos entregues e notas para o cliente.",
    category: "Pós-produção",
    tags: ["Pós-prod", "Arquivo", "Entrega"],
    processingTime: "Menos de 2 minutos",
    placeholder: "Nome do projeto, formatos de entrega, specs técnicas e observações...",
    promptRole:
      "Você é supervisor de pós-produção. Gere um relatório de entrega profissional com lista de arquivos, codecs e pendências.",
  },
  {
    id: "12",
    slug: "assistente",
    name: "Assistente Livre",
    icon: "✦",
    description:
      "Converse com a IA sobre produção, câmera, carreira ou qualquer dúvida do set.",
    category: "IA",
    tags: ["IA", "Chat", "Dúvidas"],
    processingTime: "Resposta em segundos",
    placeholder: "Faça qualquer pergunta sobre produção audiovisual...",
    promptRole:
      "Você é um assistente especializado em produção audiovisual, filmmaking e negócios criativos no Brasil. Responda de forma clara e prática.",
  },
];

export const TOOLS_BY_ID: Record<ToolId, ToolDefinition> = Object.fromEntries(
  TOOLS.map((t) => [t.id, t]),
) as Record<ToolId, ToolDefinition>;

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS_BY_ID[id as ToolId];
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

/** Landing grid — same 12 tools, display-oriented */
export const LANDING_TOOLS = TOOLS.map((t) => ({
  icon: t.icon,
  number: t.id,
  name: t.name,
  description: t.description,
  tags: t.tags,
}));
