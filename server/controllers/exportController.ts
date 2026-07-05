import { Request, Response } from 'express';
import { db, shouldUsePrisma } from '../lib/db';
import { supabase } from '../lib/supabase';
import {
  exportToExcel,
  formatProjectsForExcel,
  formatClientsForExcel,
  formatOpportunitiesForExcel,
} from '../services/export/excelExporter';
import {
  exportToCsv,
  formatProjectsForCsv,
  formatClientsForCsv,
  formatOpportunitiesForCsv,
} from '../services/export/csvExporter';
import {
  exportToPdf,
  formatProjectsForPdf,
  formatClientsForPdf,
} from '../services/export/pdfExporter';

/**
 * GET /api/export/projects/:format
 * Exporta lista de projetos
 */
export async function exportProjects(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { format } = req.params;

    // Buscar projetos
    let projects: any[];
    if (shouldUsePrisma) {
      const { data } = await supabase
        .from('projects')
        .select('*, clients(name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      projects = (data || []).map((p) => ({
        ...p,
        client_name: p.clients?.name,
      }));
    } else {
      const stmt = db.prepare(`
        SELECT p.*, c.name as client_name
        FROM projects p
        LEFT JOIN clients c ON p.client_id = c.id
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
      `);
      projects = stmt.all(userId) as any[];
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `cenastudio_projetos_${timestamp}`;

    // Exportar no formato solicitado
    if (format === 'excel') {
      const formattedData = formatProjectsForExcel(projects);
      const buffer = exportToExcel({
        data: formattedData,
        sheetName: 'Projetos',
        filename,
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
      res.send(buffer);
    } else if (format === 'csv') {
      const formattedData = formatProjectsForCsv(projects);
      const csv = exportToCsv({ data: formattedData });

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send('\uFEFF' + csv); // BOM for UTF-8
    } else if (format === 'pdf') {
      const formatted = formatProjectsForPdf(projects);
      const buffer = exportToPdf({
        title: formatted.title,
        subtitle: `Total: ${projects.length} projetos`,
        data: formatted.data,
        columns: formatted.columns,
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
      res.send(buffer);
    } else {
      res.status(400).json({ error: 'Formato inválido. Use: excel, csv ou pdf' });
    }
  } catch (error) {
    console.error('Error exporting projects:', error);
    res.status(500).json({ error: 'Erro ao exportar projetos' });
  }
}

/**
 * GET /api/export/clients/:format
 * Exporta lista de clientes
 */
export async function exportClients(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { format } = req.params;

    // Buscar clientes
    let clients: any[];
    if (shouldUsePrisma) {
      const { data } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      clients = data || [];
    } else {
      const stmt = db.prepare('SELECT * FROM clients WHERE user_id = ? ORDER BY created_at DESC');
      clients = stmt.all(userId) as any[];
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `cenastudio_clientes_${timestamp}`;

    if (format === 'excel') {
      const formattedData = formatClientsForExcel(clients);
      const buffer = exportToExcel({
        data: formattedData,
        sheetName: 'Clientes',
        filename,
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
      res.send(buffer);
    } else if (format === 'csv') {
      const formattedData = formatClientsForCsv(clients);
      const csv = exportToCsv({ data: formattedData });

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send('\uFEFF' + csv);
    } else if (format === 'pdf') {
      const formatted = formatClientsForPdf(clients);
      const buffer = exportToPdf({
        title: formatted.title,
        subtitle: `Total: ${clients.length} clientes`,
        data: formatted.data,
        columns: formatted.columns,
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
      res.send(buffer);
    } else {
      res.status(400).json({ error: 'Formato inválido. Use: excel, csv ou pdf' });
    }
  } catch (error) {
    console.error('Error exporting clients:', error);
    res.status(500).json({ error: 'Erro ao exportar clientes' });
  }
}

/**
 * GET /api/export/opportunities/:format
 * Exporta lista de oportunidades
 */
export async function exportOpportunities(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { format } = req.params;

    // Buscar oportunidades
    let opportunities: any[];
    if (shouldUsePrisma) {
      const { data } = await supabase
        .from('opportunities')
        .select('*, clients(name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      opportunities = (data || []).map((o) => ({
        ...o,
        client_name: o.clients?.name,
      }));
    } else {
      const stmt = db.prepare(`
        SELECT o.*, c.name as client_name
        FROM opportunities o
        LEFT JOIN clients c ON o.client_id = c.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
      `);
      opportunities = stmt.all(userId) as any[];
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `cenastudio_oportunidades_${timestamp}`;

    if (format === 'excel') {
      const formattedData = formatOpportunitiesForExcel(opportunities);
      const buffer = exportToExcel({
        data: formattedData,
        sheetName: 'Oportunidades',
        filename,
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
      res.send(buffer);
    } else if (format === 'csv') {
      const formattedData = formatOpportunitiesForCsv(opportunities);
      const csv = exportToCsv({ data: formattedData });

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send('\uFEFF' + csv);
    } else {
      res.status(400).json({ error: 'Formato inválido. Use: excel ou csv' });
    }
  } catch (error) {
    console.error('Error exporting opportunities:', error);
    res.status(500).json({ error: 'Erro ao exportar oportunidades' });
  }
}
