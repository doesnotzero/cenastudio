import * as XLSX from 'xlsx';

export interface ExcelExportOptions {
  data: any[];
  columns?: string[];
  sheetName?: string;
  filename?: string;
}

/**
 * Exporta dados para Excel (.xlsx)
 */
export function exportToExcel(options: ExcelExportOptions): Buffer {
  const { data, columns, sheetName = 'Sheet1' } = options;

  // Se columns não for especificado, usar todas as keys do primeiro item
  const cols = columns || (data.length > 0 ? Object.keys(data[0]) : []);

  // Criar worksheet
  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: cols,
  });

  // Estilizar header (largura de colunas)
  const colWidths = cols.map((col) => {
    const maxLength = Math.max(
      col.length,
      ...data.map((row) => String(row[col] || '').length)
    );
    return { wch: Math.min(maxLength + 2, 50) }; // Max 50 chars
  });
  worksheet['!cols'] = colWidths;

  // Criar workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Gerar buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer as Buffer;
}

/**
 * Formata dados de projetos para export
 */
export function formatProjectsForExcel(projects: any[]): any[] {
  return projects.map((project) => ({
    ID: project.id,
    Nome: project.name,
    Cliente: project.client_name || 'N/A',
    Status: project.status,
    'Data Criação': new Date(project.created_at).toLocaleDateString('pt-BR'),
    'Última Atualização': new Date(project.updated_at).toLocaleDateString('pt-BR'),
  }));
}

/**
 * Formata dados de clientes para export
 */
export function formatClientsForExcel(clients: any[]): any[] {
  return clients.map((client) => ({
    ID: client.id,
    Nome: client.name,
    Empresa: client.company || 'N/A',
    Email: client.email || 'N/A',
    Telefone: client.phone || 'N/A',
    Segmento: client.segment,
    Status: client.status,
    'Total Gasto': client.total_spent
      ? `R$ ${client.total_spent.toLocaleString('pt-BR')}`
      : 'R$ 0,00',
    'Data Cadastro': new Date(client.created_at).toLocaleDateString('pt-BR'),
  }));
}

/**
 * Formata dados de oportunidades para export
 */
export function formatOpportunitiesForExcel(opportunities: any[]): any[] {
  return opportunities.map((opp) => ({
    ID: opp.id,
    Título: opp.title,
    Cliente: opp.client_name || 'N/A',
    Estágio: opp.stage,
    'Valor Estimado': opp.estimated_value
      ? `R$ ${opp.estimated_value.toLocaleString('pt-BR')}`
      : 'N/A',
    'Probabilidade (%)': opp.probability || 0,
    'Previsão Fechamento': opp.expected_close_date
      ? new Date(opp.expected_close_date).toLocaleDateString('pt-BR')
      : 'N/A',
    'Data Criação': new Date(opp.created_at).toLocaleDateString('pt-BR'),
  }));
}
