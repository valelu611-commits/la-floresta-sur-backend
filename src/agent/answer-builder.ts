import type { Category } from "../domain/types/place.js";
import type { SearchHit } from "../services/search-types.js";
import type { AgentGroup } from "./agent-service.js";
import { DISCLAIMER, hitLine } from "./format.js";

export const SUGGESTIONS = [
  "¿Dónde hay veterinarias cerca al parque?",
  "¿Cómo está la malla vial y qué calles tienen obras?",
  "¿Qué robos se reportaron este año y en qué zonas?",
  "¿Qué CAI y cámaras de seguridad hay en el barrio?",
  "¿Qué transporte público pasa por La Floresta Sur?",
];

export function groupByCategory(hits: SearchHit[], categories: Category[]): AgentGroup[] {
  const groups = new Map<string, AgentGroup>();
  for (const hit of hits) {
    const category = categories.find((item) => item.slug === hit.categorySlug);
    if (!category) continue;
    const group = groups.get(category.slug) ?? {
      slug: category.slug,
      name: category.name,
      color: category.color,
      items: [],
    };
    group.items.push(hit);
    groups.set(category.slug, group);
  }
  return [...groups.values()];
}

export function rulesAnswer(question: string, groups: AgentGroup[]): string {
  if (groups.length === 0) {
    return (
      `No encontre registros para "${question}" en La Floresta Sur. ` +
      "Prueba con una categoria (veterinarias, CAI, transporte, comida, camaras, calles) " +
      `o revisa el mapa interactivo.\n\n${DISCLAIMER}`
    );
  }
  const blocks = groups.map((group) => {
    const lines = group.items.slice(0, 4).map(hitLine).join("\n");
    return `**${group.name}** (${group.items.length} registros)\n${lines}`;
  });
  return `${blocks.join("\n\n")}\n\n${DISCLAIMER}`;
}
