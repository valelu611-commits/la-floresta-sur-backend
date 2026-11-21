import type { CadastralPropertyInput, LocalityInput } from "../domain/types/cadastre.js";

export const cadastralSeeds: CadastralPropertyInput[] = [
  {
    address: "Calle 49 Sur # 87-12", upz: "UPZ 79 Caldas", barrio: "La Floresta Sur",
    stratum: 2, landUse: "comercial", areaM2: 96, cadastralRef: "79-05-0123-0001",
    lat: 4.6108, lon: -74.1519, notes: "Local de libreria en primer piso.",
    source: "Datos catastrales de ejemplo",
  },
  {
    address: "Calle 50 Sur # 87-18", upz: "UPZ 79 Caldas", barrio: "La Floresta Sur",
    stratum: 2, landUse: "mixto", areaM2: 140, cadastralRef: "79-05-0144-0007",
    lat: 4.6117, lon: -74.1522, notes: "Vivienda con veterinaria en fachada.",
    source: "Datos catastrales de ejemplo",
  },
  {
    address: "Carrera 88 # 50-31 Sur", upz: "UPZ 79 Caldas", barrio: "La Floresta Sur",
    stratum: 2, landUse: "comercial", areaM2: 210, cadastralRef: "79-05-0210-0012",
    lat: 4.6110, lon: -74.1489, notes: "Predio de asadero con patio interior.",
    source: "Datos catastrales de ejemplo",
  },
  {
    address: "Calle 51 Sur # 87-30", upz: "UPZ 79 Caldas", barrio: "La Floresta Sur",
    stratum: 1, landUse: "institucional", areaM2: 3200, cadastralRef: "79-05-0301-0001",
    lat: 4.6126, lon: -74.1504, notes: "Sede del IED La Floresta Sur.",
    source: "Datos catastrales de ejemplo",
  },
  {
    address: "Calle 52 Sur # 88-14", upz: "UPZ 79 Caldas", barrio: "La Floresta Sur",
    stratum: 3, landUse: "residencial", areaM2: 120, cadastralRef: "79-05-0412-0021",
    lat: 4.6132, lon: -74.1472, notes: "Casa de dos pisos con local en esquina.",
    source: "Datos catastrales de ejemplo",
  },
  {
    address: "Calle 48 Sur # 87-40", upz: "UPZ 79 Caldas", barrio: "La Floresta Sur",
    stratum: 1, landUse: "residencial", areaM2: 78, cadastralRef: "79-05-0508-0033",
    lat: 4.6089, lon: -74.1516, notes: "Vivienda de autoconstruccion en dos niveles.",
    source: "Datos catastrales de ejemplo",
  },
  {
    address: "Av. Ciudad de Cali # 51-40 Sur", upz: "UPZ 79 Caldas", barrio: "La Floresta Sur",
    stratum: 3, landUse: "comercial", areaM2: 180, cadastralRef: "79-05-0602-0004",
    lat: 4.6130, lon: -74.1558, notes: "Predio esquinero con uso gastronomico.",
    source: "Datos catastrales de ejemplo",
  },
  {
    address: "Calle 53 Sur # 88-30", upz: "UPZ 79 Caldas", barrio: "La Floresta Sur",
    stratum: 2, landUse: "dotacional", areaM2: 2600, cadastralRef: "79-05-0715-0002",
    lat: 4.6150, lon: -74.1470, notes: "Zona verde y cancha multiple de cesion.",
    source: "Datos catastrales de ejemplo",
  },
];

export const localitySeeds: LocalityInput[] = [
  {
    name: "La Floresta Sur", code: "B-79-05", mayor: "Junta de Accion Comunal La Floresta Sur",
    population: 8450, areaHa: 63, upz: "UPZ 79 Caldas",
    description:
      "Barrio residencial del sur de Kennedy, con comercio de escala barrial, " +
      "dos colegios, parque principal y conexion a la Av. Ciudad de Cali.",
    lat: 4.6112, lon: -74.1508, bbox: "-74.1586,4.6040,-74.1440,4.6182",
    source: "Perfil barrial de ejemplo",
  },
  {
    name: "Kennedy", code: "08", mayor: "Alcaldia Local de Kennedy",
    population: 1270000, areaHa: 3856, upz: "13 UPZ (44 a 82)",
    description:
      "Localidad 8 de Bogota. Limita con Fontibon, Puente Aranda, Bosa y el " +
      "municipio de Mosquera. Concentra el Portal de las Americas y Corabastos.",
    lat: 4.6280, lon: -74.1450, bbox: "-74.1900,4.5800,-74.1000,4.6700",
    source: "Datos abiertos de ejemplo",
  },
];
