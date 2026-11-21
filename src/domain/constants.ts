export const INCIDENT_KINDS = [
  "hurto_persona",
  "hurto_residencia",
  "hurto_comercio",
  "hurto_bicicleta",
  "hurto_moto",
  "hurto_celular",
  "vandalismo",
  "rina",
  "otro",
] as const;

export const SEVERITIES = ["baja", "media", "alta"] as const;

export const ROAD_CONDITIONS = ["bueno", "regular", "deteriorado"] as const;

export const ROAD_STATUSES = ["transitable", "obras", "cerrada"] as const;

export const LAND_USES = [
  "residencial",
  "comercial",
  "mixto",
  "institucional",
  "dotacional",
] as const;

export const INCIDENT_KIND_LABELS: Record<string, string> = {
  hurto_persona: "hurto a persona",
  hurto_residencia: "hurto a residencia",
  hurto_comercio: "hurto a comercio",
  hurto_bicicleta: "hurto de bicicleta",
  hurto_moto: "hurto de moto",
  hurto_celular: "hurto de celular",
  vandalismo: "vandalismo",
  rina: "rina",
  otro: "otro hecho",
};
