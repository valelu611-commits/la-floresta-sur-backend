import type { CategoryInput } from "../domain/types/place.js";

export const categoriesExtra: CategoryInput[] = [
  {
    slug: "veterinarias", name: "Veterinarias", resource: "places",
    color: "#10B981", icon: "paw", sortOrder: 8,
    description: "Atencion veterinaria, vacunacion y pet shops.",
  },
  {
    slug: "localidad", name: "Localidad de Kennedy", resource: "localities",
    color: "#EAB308", icon: "map", sortOrder: 9,
    description: "Contexto de la localidad, UPZ y datos del barrio.",
  },
  {
    slug: "zonas-verdes", name: "Zonas verdes", resource: "places",
    color: "#84CC16", icon: "trees", sortOrder: 10,
    description: "Parques, rondas y espacios de recreacion.",
  },
  {
    slug: "transporte", name: "Transporte", resource: "places",
    color: "#06B6D4", icon: "bus", sortOrder: 11,
    description: "TransMilenio, SITP, paraderos y ciclovias.",
  },
  {
    slug: "deportes", name: "Escenarios deportivos", resource: "places",
    color: "#F43F5E", icon: "trophy", sortOrder: 12,
    description: "Canchas, polideportivos y espacios para entrenar.",
  },
  {
    slug: "educacion", name: "Centros educativos", resource: "places",
    color: "#8B5CF6", icon: "graduation", sortOrder: 13,
    description: "Colegios, jardines y bibliotecas escolares.",
  },
];
