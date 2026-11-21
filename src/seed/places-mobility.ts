import type { PlaceInput } from "../domain/types/place.js";
import { place } from "./helpers.js";

export const mobilityPlaces: PlaceInput[] = [
  place("camaras", "Camara Parque La Floresta Sur", "Parque La Floresta Sur, Calle 50 Sur", 4.6114, -74.1512,
    "Camara PTZ del sistema de video vigilancia de la localidad.",
    { metadata: { tipo: "PTZ", entidad: "Policia Metropolitana" } }),
  place("camaras", "Camara Av. Ciudad de Cali x Calle 49 Sur", "Av. Ciudad de Cali # 49-10 Sur", 4.6086, -74.1544,
    "Camara de lectura de placas en el corredor principal.",
    { metadata: { tipo: "LPR", entidad: "Movilidad" } }),
  place("camaras", "Camara IED La Floresta Sur", "Calle 51 Sur # 87-30", 4.6124, -74.1508,
    "Camara de entorno escolar monitoreada por el CAI.",
    { metadata: { tipo: "fija", entidad: "Policia Metropolitana" } }),
  place("camaras", "Camara Salón Comunal", "Calle 49 Sur # 87-70", 4.6104, -74.1502,
    "Punto de monitoreo comunitario con alerta al cuadrante.",
    { metadata: { tipo: "fija", entidad: "JAC La Floresta Sur" } }),
  place("transporte", "Estacion TransMilenio Portal de las Americas", "Av. de las Americas # 80-00", 4.6294, -74.1596,
    "Portal del sistema TransMilenio con rutas troncales de la Av. de las Americas.",
    { hours: "Lun-Dom 4:00-23:30", metadata: { sistema: "TransMilenio", linea: "Americas" } }),
  place("transporte", "Paradero SITP Calle 49 Sur", "Calle 49 Sur # 88-20", 4.6091, -74.1484,
    "Paradero del SITP con rutas hacia Kennedy Central y Bosa.",
    { hours: "Lun-Sab 5:00-22:00", metadata: { sistema: "SITP", rutas: "7-4, 9-11" } }),
  place("transporte", "Paradero SITP Av. Ciudad de Cali", "Av. Ciudad de Cali # 50-60 Sur", 4.6122, -74.1560,
    "Paradero sobre el corredor de la Av. Ciudad de Cali.",
    { hours: "Lun-Sab 4:30-23:00", metadata: { sistema: "SITP", rutas: "10-3, 12-8" } }),
  place("transporte", "Ciclovia Calle 50 Sur", "Calle 50 Sur entre Carrera 86 y 89", 4.6118, -74.1501,
    "Tramo de ciclovia dominical y biciparqueo comunitario.",
    { hours: "Dom 7:00-14:00", metadata: { sistema: "Recreovia" } }),
];
