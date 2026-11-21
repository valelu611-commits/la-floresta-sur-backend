import type { CategoryInput } from "../domain/types/place.js";

export const categoriesCore: CategoryInput[] = [
  {
    slug: "seguridad", name: "Robos y seguridad", resource: "security-incidents",
    color: "#FF3B5C", icon: "shield", sortOrder: 1,
    description: "Hurtos, vandalismo y hechos reportados en el barrio.",
  },
  {
    slug: "malla-vial", name: "Estado de calles", resource: "road-segments",
    color: "#FFB020", icon: "road", sortOrder: 2,
    description: "Huecos, obras y transitabilidad de la malla vial.",
  },
  {
    slug: "catastral", name: "Datos catastrales", resource: "cadastral-properties",
    color: "#22D3EE", icon: "building", sortOrder: 3,
    description: "Predios, estratos, usos del suelo y referencias catastrales.",
  },
  {
    slug: "librerias", name: "Librerias", resource: "places",
    color: "#A855F7", icon: "book", sortOrder: 4,
    description: "Librerias, papelarias y puntos de utiles escolares.",
  },
  {
    slug: "cai", name: "CAI", resource: "places",
    color: "#3B82F6", icon: "badge", sortOrder: 5,
    description: "Centros de Atencion Inmediata de la Policia.",
  },
  {
    slug: "camaras", name: "Camaras de seguridad", resource: "places",
    color: "#64748B", icon: "camera", sortOrder: 6,
    description: "Camaras de vigilancia y puntos de monitoreo.",
  },
  {
    slug: "comida", name: "Sitios de comida", resource: "places",
    color: "#F97316", icon: "utensils", sortOrder: 7,
    description: "Restaurantes, panaderias, asaderos y tiendas.",
  },
];
