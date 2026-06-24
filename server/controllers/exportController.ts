import { RequestHandler } from "express";
import { db } from "../models/db.js";
import { AppError } from "../middleware/errorHandler.js";

// Export project data to various formats
export const exportProject: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const projectId = parseInt(req.params.id);
    const format = req.query.format as string || "json";

    if (!projectId) {
      throw new AppError("Project ID is required", 400);
    }

    // Fetch project data
    const project = db
      .prepare("SELECT * FROM projects WHERE id = ? AND user_id = ?")
      .get(projectId, userId);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    // Fetch project states
    const states = db
      .prepare("SELECT * FROM project_states WHERE project_id = ?")
      .all(projectId);

    const exportData = {
      project,
      states,
      exportedAt: new Date().toISOString(),
      exportedBy: userId,
    };

    switch (format) {
      case "json":
        res.setHeader("Content-Type", "application/json");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="project-${projectId}-${Date.now()}.json"`,
        );
        res.json(exportData);
        break;

      case "csv":
        // Simple CSV export for states
        const csvHeader = "tool_id,form_data,output_data,updated_at\n";
        const csvRows = states
          .map(
            (state: any) =>
              `"${state.tool_id}","${state.form_data?.replace(/"/g, '""') || ""}","${
                state.output_data?.replace(/"/g, '""') || ""
              }","${state.updated_at}"`,
          )
          .join("\n");
        const csv = csvHeader + csvRows;

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="project-${projectId}-${Date.now()}.csv"`,
        );
        res.send(csv);
        break;

      default:
        throw new AppError("Unsupported format. Use 'json' or 'csv'", 400);
    }
  } catch (e) {
    next(e);
  }
};

// Export client data
export const exportClient: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const clientId = parseInt(req.params.id);
    const format = req.query.format as string || "json";

    if (!clientId) {
      throw new AppError("Client ID is required", 400);
    }

    // Fetch client data
    const client = db
      .prepare("SELECT * FROM clients WHERE id = ? AND user_id = ?")
      .get(clientId, userId);

    if (!client) {
      throw new AppError("Client not found", 404);
    }

    // Fetch client opportunities
    const opportunities = db
      .prepare("SELECT * FROM opportunities WHERE client_id = ?")
      .all(clientId);

    // Fetch client interactions
    const interactions = db
      .prepare("SELECT * FROM interactions WHERE client_id = ?")
      .all(clientId);

    // Fetch client projects
    const projects = db
      .prepare("SELECT * FROM projects WHERE client_id = ?")
      .all(clientId);

    const exportData = {
      client,
      opportunities,
      interactions,
      projects,
      exportedAt: new Date().toISOString(),
      exportedBy: userId,
    };

    switch (format) {
      case "json":
        res.setHeader("Content-Type", "application/json");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="client-${clientId}-${Date.now()}.json"`,
        );
        res.json(exportData);
        break;

      case "csv":
        // CSV export for opportunities
        const oppHeader = "id,title,stage,estimated_value,probability,expected_close_date,created_at\n";
        const oppRows = opportunities
          .map(
            (opp: any) =>
              `${opp.id},"${opp.title}","${opp.stage}",${opp.estimated_value || 0},${
                opp.probability
              },"${opp.expected_close_date || ""}","${opp.created_at}"`,
          )
          .join("\n");
        const csv = oppHeader + oppRows;

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="client-${clientId}-opportunities-${Date.now()}.csv"`,
        );
        res.send(csv);
        break;

      default:
        throw new AppError("Unsupported format. Use 'json' or 'csv'", 400);
    }
  } catch (e) {
    next(e);
  }
};

// Export all clients
export const exportAllClients: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const format = req.query.format as string || "json";

    const clients = db
      .prepare("SELECT * FROM clients WHERE user_id = ?")
      .all(userId);

    const exportData = {
      clients,
      exportedAt: new Date().toISOString(),
      exportedBy: userId,
      totalClients: clients.length,
    };

    switch (format) {
      case "json":
        res.setHeader("Content-Type", "application/json");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="all-clients-${Date.now()}.json"`,
        );
        res.json(exportData);
        break;

      case "csv":
        const csvHeader =
          "id,name,company,email,phone,segment,status,total_spent,first_contact_at,last_contact_at,created_at\n";
        const csvRows = clients
          .map(
            (client: any) =>
              `${client.id},"${client.name}","${client.company || ""}","${client.email || ""}","${
                client.phone || ""
              }","${client.segment}","${client.status}",${client.total_spent || 0},"${
                client.first_contact_at || ""
              }","${client.last_contact_at || ""}","${client.created_at}"`,
          )
          .join("\n");
        const csv = csvHeader + csvRows;

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="all-clients-${Date.now()}.csv"`,
        );
        res.send(csv);
        break;

      default:
        throw new AppError("Unsupported format. Use 'json' or 'csv'", 400);
    }
  } catch (e) {
    next(e);
  }
};

// Export pipeline data
export const exportPipeline: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const format = req.query.format as string || "json";

    const opportunities = db
      .prepare(`
        SELECT o.*, c.name as client_name, c.company as client_company
        FROM opportunities o
        LEFT JOIN clients c ON o.client_id = c.id
        WHERE o.user_id = ?
      `)
      .all(userId);

    const exportData = {
      opportunities,
      exportedAt: new Date().toISOString(),
      exportedBy: userId,
      totalOpportunities: opportunities.length,
      totalPipelineValue: opportunities.reduce(
        (sum: number, opp: any) => sum + (opp.estimated_value || 0),
        0,
      ),
    };

    switch (format) {
      case "json":
        res.setHeader("Content-Type", "application/json");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="pipeline-${Date.now()}.json"`,
        );
        res.json(exportData);
        break;

      case "csv":
        const csvHeader =
          "id,title,client_name,client_company,stage,estimated_value,probability,expected_close_date,created_at\n";
        const csvRows = opportunities
          .map(
            (opp: any) =>
              `${opp.id},"${opp.title}","${opp.client_name || ""}","${opp.client_company || ""}","${
                opp.stage
              }",${opp.estimated_value || 0},${opp.probability},"${opp.expected_close_date || ""}","${
                opp.created_at
              }"`,
          )
          .join("\n");
        const csv = csvHeader + csvRows;

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="pipeline-${Date.now()}.csv"`,
        );
        res.send(csv);
        break;

      default:
        throw new AppError("Unsupported format. Use 'json' or 'csv'", 400);
    }
  } catch (e) {
    next(e);
  }
};
