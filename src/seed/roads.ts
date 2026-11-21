import type { RoadSegmentInput } from "../domain/types/safety.js";

export const roadSeeds: RoadSegmentInput[] = [
  {
    name: "Av. Ciudad de Cali", fromStreet: "Calle 48 Sur", toStreet: "Calle 53 Sur",
    condition: "deteriorado", status: "obras", lengthM: 620, lat: 4.6112, lon: -74.1559,
    geomWkt: "LINESTRING (-74.1552 4.6086, -74.1566 4.6138)",
    lastReportedAt: "2026-11-03", description: "Repavimentacion por tramos y cierre de un carril.",
    source: "Reporte ciudadano de ejemplo",
  },
  {
    name: "Calle 49 Sur", fromStreet: "Carrera 86", toStreet: "Carrera 89",
    condition: "regular", status: "transitable", lengthM: 410, lat: 4.6106, lon: -74.1506,
    geomWkt: "LINESTRING (-74.1528 4.6106, -74.1484 4.6106)",
    lastReportedAt: "2026-10-28", description: "Huecos puntuales frente a la panaderia.",
    source: "Reporte ciudadano de ejemplo",
  },
  {
    name: "Carrera 87", fromStreet: "Calle 48 Sur", toStreet: "Calle 52 Sur",
    condition: "bueno", status: "transitable", lengthM: 480, lat: 4.6110, lon: -74.1498,
    geomWkt: "LINESTRING (-74.1498 4.6085, -74.1498 4.6138)",
    lastReportedAt: "2026-10-12", description: "Via rehabilitada en 2025, sin huecos reportados.",
    source: "Datos de ejemplo",
  },
  {
    name: "Calle 52 Sur", fromStreet: "Carrera 86", toStreet: "Carrera 89",
    condition: "deteriorado", status: "transitable", lengthM: 390, lat: 4.6137, lon: -74.1495,
    geomWkt: "LINESTRING (-74.1530 4.6137, -74.1460 4.6137)",
    lastReportedAt: "2026-11-08", description: "Pavimento agrietado y hundimiento junto al parque.",
    source: "Reporte ciudadano de ejemplo",
  },
  {
    name: "Calle 50 Sur", fromStreet: "Carrera 87", toStreet: "Carrera 88",
    condition: "regular", status: "obras", lengthM: 220, lat: 4.6119, lon: -74.1502,
    geomWkt: "LINESTRING (-74.1516 4.6119, -74.1488 4.6119)",
    lastReportedAt: "2026-11-11", description: "Obra de acueducto con paso restringido.",
    source: "Reporte ciudadano de ejemplo",
  },
  {
    name: "Diagonal 50 Sur", fromStreet: "Carrera 88", toStreet: "Av. Ciudad de Cali",
    condition: "regular", status: "transitable", lengthM: 350, lat: 4.6145, lon: -74.1529,
    geomWkt: "LINESTRING (-74.1489 4.6147, -74.1560 4.6143)",
    lastReportedAt: "2026-09-30", description: "Senalizacion desgastada en la interseccion.",
    source: "Datos de ejemplo",
  },
  {
    name: "Carrera 88", fromStreet: "Calle 49 Sur", toStreet: "Calle 53 Sur",
    condition: "bueno", status: "transitable", lengthM: 430, lat: 4.6118, lon: -74.1477,
    geomWkt: "LINESTRING (-74.1477 4.6096, -74.1477 4.6150)",
    lastReportedAt: "2026-10-05", description: "Corredor en buen estado con ciclorruta pintada.",
    source: "Datos de ejemplo",
  },
  {
    name: "Calle 48 Sur", fromStreet: "Carrera 86", toStreet: "Carrera 88",
    condition: "deteriorado", status: "transitable", lengthM: 300, lat: 4.6088, lon: -74.1499,
    geomWkt: "LINESTRING (-74.1525 4.6088, -74.1474 4.6088)",
    lastReportedAt: "2026-11-01", description: "Hundimiento frente al jardin infantil.",
    source: "Reporte ciudadano de ejemplo",
  },
];
