import {
  BarChart3,
  Calendar,
  Clipboard,
  DollarSign,
  FileCheck,
  FileText,
  Film,
  ListChecks,
  MessageCircle,
  Palette,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

const ICON_BY_SLUG: Record<string, LucideIcon> = {
  roteiro: Film,
  decupagem: FileText,
  callsheet: Clipboard,
  orcamento: DollarSign,
  proposta: FileCheck,
  contrato: ScrollText,
  briefing: FileText,
  moodboard: Palette,
  checklist: ListChecks,
  cronograma: Calendar,
  entrega: BarChart3,
  assistente: MessageCircle,
};

export function getToolIcon(slug: string): LucideIcon {
  return ICON_BY_SLUG[slug] ?? Film;
}
