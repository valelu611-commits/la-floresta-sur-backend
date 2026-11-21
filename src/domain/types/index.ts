export * from "./common.js";
export * from "./place.js";
export * from "./safety.js";
export * from "./cadastre.js";

export const CATEGORY_LABELS: Record<string, string> = {
  seguridad: "Robos y seguridad ciudadana",
  "malla-vial": "Estado de las calles",
  catastral: "Datos catastrales",
  librerias: "Librerias",
  cai: "CAI",
  camaras: "Camaras de seguridad",
  comida: "Sitios de comida",
  veterinarias: "Veterinarias",
  localidad: "Localidad de Kennedy",
  "zonas-verdes": "Zonas verdes y parques",
  transporte: "Transporte publico",
  deportes: "Escenarios deportivos",
  educacion: "Centros educativos",
};

export const PLACE_CATEGORIES = [
  "librerias",
  "cai",
  "camaras",
  "comida",
  "veterinarias",
  "zonas-verdes",
  "transporte",
  "deportes",
  "educacion",
] as const;

export type PlaceCategorySlug = (typeof PLACE_CATEGORIES)[number];
