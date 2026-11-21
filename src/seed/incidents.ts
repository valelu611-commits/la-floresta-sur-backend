import type { SecurityIncidentInput } from "../domain/types/safety.js";

function incident(
  title: string,
  kind: string,
  occurredAt: string,
  timeRange: string,
  placeHint: string,
  lat: number,
  lon: number,
  severity: "baja" | "media" | "alta",
  weapon: string,
  description: string,
): SecurityIncidentInput {
  return {
    title, kind, occurredAt, timeRange, placeHint, lat, lon, severity, weapon, description,
    source: "Reporte ciudadano de ejemplo",
  };
}

export const incidentSeeds: SecurityIncidentInput[] = [
  incident("Hurto de celular a mano armada", "hurto_celular", "2026-10-18", "19:30-20:00",
    "Calle 50 Sur con Carrera 87", 4.6115, -74.1517, "alta", "arma blanca",
    "Dos personas abordan a un transeunte en la esquina del parque."),
  incident("Hurto a residencia en ausencia", "hurto_residencia", "2026-10-11", "08:00-16:00",
    "Calle 49 Sur # 88-12", 4.6092, -74.1479, "alta", "sin arma",
    "Ingreso por ventana trasera durante la jornada laboral."),
  incident("Hurto de bicicleta en paradero", "hurto_bicicleta", "2026-09-29", "06:40-07:00",
    "Paradero SITP Calle 49 Sur", 4.6091, -74.1484, "media", "sin arma",
    "Sustraccion de bicicleta asegurada al biciparqueo del paradero."),
  incident("Hurto a comercio", "hurto_comercio", "2026-09-22", "20:15-20:25",
    "Panaderia Calle 49 Sur # 87-24", 4.6106, -74.1514, "media", "arma de fuego",
    "Ingreso de dos personas al cierre del establecimiento."),
  incident("Rina en zona de rumba", "rina", "2026-09-14", "23:30-00:10",
    "Av. Ciudad de Cali con Calle 51 Sur", 4.6130, -74.1558, "media", "sin arma",
    "Discusion entre clientes de establecimientos nocturnos."),
  incident("Hurto de moto parqueada", "hurto_moto", "2026-08-30", "22:00-06:00",
    "Calle 52 Sur # 87-45", 4.6136, -74.1499, "alta", "sin arma",
    "Moto de alto cilindraje sustraida frente a la zona verde."),
  incident("Vandalismo en salon comunal", "vandalismo", "2026-08-21", "02:00-03:00",
    "Calle 49 Sur # 87-70", 4.6104, -74.1502, "baja", "sin arma",
    "Grafitis y danos menores en puertas del salon comunal."),
  incident("Hurto a persona en puente peatonal", "hurto_persona", "2026-08-09", "05:30-05:45",
    "Av. Ciudad de Cali # 50-60 Sur", 4.6122, -74.1560, "media", "arma blanca",
    "Sustraccion de bolso a persona que esperaba transporte."),
  incident("Intento de hurto a adulto mayor", "hurto_persona", "2026-07-27", "14:00-14:15",
    "Calle 48 Sur # 87-40", 4.6089, -74.1516, "baja", "sin arma",
    "Vecinos intervienen y el sospechoso huye sin lograr el hurto."),
];
