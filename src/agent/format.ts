import type { SearchHit } from "../services/search-types.js";

export function hitLine(hit: SearchHit): string {
  const details: string[] = [];
  if (hit.subtitle) details.push(hit.subtitle);
  if (hit.meta?.severity) details.push(`severidad ${hit.meta.severity}`);
  if (hit.meta?.areaM2) details.push(`${hit.meta.areaM2} m2`);
  return `• **${hit.title}**${details.length > 0 ? ` — ${details.join(" · ")}` : ""}`;
}

export function describePlace(hit: SearchHit): string {
  return `${hit.title} (${hit.subtitle}) en ${hit.lat.toFixed(5)}, ${hit.lon.toFixed(5)}`;
}

export function buildContext(groups: Array<{ name: string; items: SearchHit[] }>): string {
  return groups
    .map((group) => {
      const items = group.items.slice(0, 4).map((hit) => `- ${hitLine(hit).replace("• ", "")}`);
      return `${group.name}:\n${items.join("\n")}`;
    })
    .join("\n\n");
}

export const DISCLAIMER =
  "Datos abiertos de ejemplo del barrio La Floresta Sur (UPZ 79, Kennedy). " +
  "Verifica siempre con la fuente oficial antes de tomar decisiones.";
