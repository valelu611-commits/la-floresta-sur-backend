import type { SearchService } from "../services/search-service.js";
import type { SearchHit } from "../services/search-types.js";
import type { AgentGroup } from "./agent-service.js";
import { buildContext } from "./format.js";
import type { LlmClient } from "./llm-client.js";

export async function searchFallback(search: SearchService, tokens: string[]): Promise<SearchHit[]> {
  const unique = new Map<string, SearchHit>();
  for (const token of tokens) {
    const result = await search.search(token, 4);
    for (const hit of result.hits) unique.set(`${hit.resource}:${hit.id}`, hit);
  }
  return [...unique.values()].slice(0, 10);
}

export async function tryLlm(
  llm: LlmClient | null,
  question: string,
  groups: AgentGroup[],
  fallback: string,
): Promise<string | null> {
  if (!llm || groups.length === 0) return null;
  const system =
    "Eres el asistente ciudadano de La Floresta Sur, barrio de Kennedy, Bogota. " +
    "Responde en espanol, en maximo 6 frases, usando SOLO los datos entregados. " +
    "Si falta un dato dilo con claridad. No inventes direcciones ni cifras.";
  const user = `Pregunta: ${question}\n\nDatos:\n${buildContext(groups)}\n\nBorrador: ${fallback}`;
  const answer = await llm.complete(system, user);
  return answer && answer.length > 20 ? answer : null;
}
