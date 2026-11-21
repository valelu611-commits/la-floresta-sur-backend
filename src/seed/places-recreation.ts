import type { PlaceInput } from "../domain/types/place.js";
import { place } from "./helpers.js";

export const recreationPlaces: PlaceInput[] = [
  place("zonas-verdes", "Parque La Floresta Sur", "Calle 50 Sur entre Carrera 86 y 88", 4.6113, -74.1510,
    "Parque principal con juegos infantiles, gimnasio al aire libre y arbolado.",
    { hours: "Lun-Dom 6:00-21:00", metadata: { areaM2: 4200 } }),
  place("zonas-verdes", "Parque Infantil Calle 52 Sur", "Calle 52 Sur # 87-45", 4.6136, -74.1499,
    "Zona verde con juegos para primera infancia y bancas.",
    { hours: "Lun-Dom 7:00-20:00", metadata: { areaM2: 1800 } }),
  place("zonas-verdes", "Ronda del Canal La Floresta", "Carrera 89 # 48-00 Sur", 4.6078, -74.1462,
    "Corredor verde junto al canal, usado para caminar y montar bicicleta.",
    { hours: "Lun-Dom 5:00-20:00", metadata: { areaM2: 6500 } }),
  place("zonas-verdes", "Zona Verde Los Sauces", "Calle 53 Sur # 88-30", 4.6150, -74.1470,
    "Zona verde arborizada con cancha multiple.",
    { hours: "Lun-Dom 6:00-21:00", metadata: { areaM2: 2600 } }),
  place("deportes", "Cancha de Futbol La Floresta Sur", "Calle 51 Sur # 86-70", 4.6122, -74.1532,
    "Cancha de futbol 8 con grama sintetica y alumbrado.",
    { hours: "Lun-Dom 6:00-22:00", metadata: { disciplina: "futbol", superficie: "sintetica" } }),
  place("deportes", "Polideportivo Los Sauces", "Calle 53 Sur # 88-35", 4.6151, -74.1468,
    "Cancha multiple de baloncesto, microfutbol y voleibol.",
    { hours: "Lun-Dom 6:00-21:00", metadata: { disciplina: "multiple" } }),
  place("deportes", "Parque de Patinaje El Triunfo", "Carrera 87 # 52-10 Sur", 4.6138, -74.1486,
    "Placa de patinaje y espacio para entrenamiento funcional.",
    { hours: "Lun-Dom 6:00-21:00", metadata: { disciplina: "patinaje" } }),
];
