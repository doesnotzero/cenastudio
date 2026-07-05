import Papa from 'papaparse';

export interface CsvExportOptions {
  data: any[];
  columns?: string[];
  delimiter?: string;
}

/**
 * Exporta dados para CSV
 */
export function exportToCsv(options: CsvExportOptions): string {
  const { data, columns, delimiter = ',' } = options;

  // Se columns for especificado, filtrar apenas essas colunas
  const dataToExport = columns
    ? data.map((row) => {
        const filtered: any = {};
        columns.forEach((col) => {
          filtered[col] = row[col];
        });
        return filtered;
      })
    : data;

  // Usar papaparse para gerar CSV
  const csv = Papa.unparse(dataToExport, {
    delimiter,
    header: true,
    quotes: true,
  });

  return csv;
}

/**
 * Formata dados de projetos para CSV
 */
export function formatProjectsForCsv(projects: any[]): any[] {
  return projects.map((project) => ({
    id: project.id,
    nome: project.name,
    cliente: project.client_name || 'N/A',
    status: project.status,
    data_criacao: new Date(project.created_at).toLocaleDateString('pt-BR'),
    ultima_atualizacao: new Date(project.updated_at).toLocaleDateString('pt-BR'),
  }));
}

/**
 * Formata dados de clientes para CSV
 */
export function formatClientsForCsv(clients: any[]): any[] {
  return clients.map((client) => ({
    id: client.id,
    nome: client.name,
    empresa: client.company || 'N/A',
    email: client.email || 'N/A',
    telefone: client.phone || 'N/A',
    segmento: client.segment,
    status: client.status,
    total_gasto: client.total_spent || 0,
    data_cadastro: new Date(client.created_at).toLocaleDateString('pt-BR'),
  }));
}

/**
 * Formata dados de oportunidades para CSV
 */
export function formatOpportunitiesForCsv(opportunities: any[]): any[] {
  return opportunities.map((opp) => ({
    id: opp.id,
    titulo: opp.title,
    cliente: opp.client_name || 'N/A',
    estagio: opp.stage,
    valor_estimado: opp.estimated_value || 0,
    probabilidade: opp.probability || 0,
    previsao_fechamento: opp.expected_close_date
      ? new Date(opp.expected_close_date).toLocaleDateString('pt-BR')
      : 'N/A',
    data_criacao: new Date(opp.created_at).toLocaleDateString('pt-BR'),
  }));
}
