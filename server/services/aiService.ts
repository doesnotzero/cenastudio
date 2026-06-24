import Anthropic from "@anthropic-ai/sdk";
import { getToolById } from "@shared/tools";
import { db } from "../models/db.js";
import { AppError } from "../middleware/errorHandler.js";

export async function generateForTool(
  userId: number,
  toolId: string,
  input: Record<string, string>,
  projectId?: number | string,
): Promise<{ output: string; generationId: number }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new AppError("AI service unavailable: ANTHROPIC_API_KEY not configured", 503);
  }

  const tool = getToolById(toolId);
  if (!tool) {
    throw new AppError("Tool not found", 404);
  }

  const active = db.prepare("SELECT is_active FROM tools WHERE id = ?").get(toolId) as
    | { is_active: number }
    | undefined;
  if (!active || active.is_active === 0) {
    throw new AppError("Tool is not active", 403);
  }

  const userText =
    input.prompt ||
    input.text ||
    input.content ||
    Object.values(input).filter(Boolean).join("\n\n");

  if (!userText.trim()) {
    throw new AppError("Input is required", 400);
  }

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: `${tool.promptRole}\n\nFerramenta: ${tool.name}. Responda em português do Brasil, formato profissional para produção audiovisual.`,
    messages: [{ role: "user", content: userText }],
  });

  const output =
    message.content[0]?.type === "text"
      ? message.content[0].text
      : "Não foi possível gerar conteúdo.";

  const result = db
    .prepare(
      "INSERT INTO generations (user_id, tool_id, input, output, project_id) VALUES (?, ?, ?, ?, ?)",
    )
    .run(userId, toolId, JSON.stringify(input), output, projectId ? Number(projectId) : null);

  return { output, generationId: Number(result.lastInsertRowid) };
}
