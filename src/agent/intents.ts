export interface IntentRule {
  slug: string;
  keywords: string[];
}

export const INTENT_RULES: IntentRule[] = [
  { slug: "seguridad", keywords: ["robo", "robos", "hurto", "inseguridad", "atraco", "delito", "seguridad"] },
  { slug: "malla-vial", keywords: ["calle", "calles", "hueco", "via", "vias", "pavimento", "obra", "malla vial", "transito"] },
  { slug: "catastral", keywords: ["catastro", "predio", "predios", "estrato", "estratos", "uso del suelo", "referencia catastral"] },
  { slug: "librerias", keywords: ["libreria", "librerias", "papeleria", "libros", "utiles"] },
  { slug: "cai", keywords: ["cai", "policia", "denuncia", "cuadrante", "patrulla"] },
  { slug: "camaras", keywords: ["camara", "camaras", "vigilancia", "video", "monitoreo"] },
  { slug: "comida", keywords: ["comida", "restaurante", "comer", "panaderia", "pizzeria", "asadero", "tienda", "comercio", "mercado"] },
  { slug: "veterinarias", keywords: ["veterinaria", "veterinarias", "mascota", "mascotas", "perro", "gato", "vacuna"] },
  { slug: "localidad", keywords: ["kennedy", "localidad", "alcaldia", "upz", "barrio", "historia"] },
  { slug: "zonas-verdes", keywords: ["parque", "parques", "zona verde", "zonas verdes", "arbol", "recreacion"] },
  { slug: "transporte", keywords: ["transmilenio", "sitp", "bus", "paradero", "estacion", "transporte", "ciclovia"] },
  { slug: "deportes", keywords: ["cancha", "deporte", "deportivo", "polideportivo", "futbol", "patinaje"] },
  { slug: "educacion", keywords: ["colegio", "escuela", "educacion", "jardin", "universidad", "estudiar"] },
];

const STOPWORDS = new Set([
  "como", "cual", "cuales", "cuando", "donde", "esta", "estan", "hay", "para",
  "por", "que", "quien", "quienes", "los", "las", "del", "una", "unos", "unas",
  "con", "sin", "sobre", "cerca", "barrio", "floresta", "sur", "kennedy", "bogota",
]);

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function detectIntents(question: string): string[] {
  const text = normalize(question);
  const scores = INTENT_RULES.map((rule) => ({
    slug: rule.slug,
    score: rule.keywords.reduce((total, keyword) => (text.includes(keyword) ? total + 1 : total), 0),
  }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);
  return scores.slice(0, 3).map((entry) => entry.slug);
}

export function keywordsFromQuestion(question: string): string[] {
  const words = normalize(question)
    .split(" ")
    .filter((word) => word.length >= 4 && !STOPWORDS.has(word));
  return [...new Set(words)].slice(0, 4);
}
