/** DDL catastral y de contexto de la localidad. */
export const cadastreStatements: string[] = [
  `CREATE TABLE IF NOT EXISTS cadastral_properties (
    id VARCHAR(36) PRIMARY KEY,
    address VARCHAR(240) NOT NULL,
    upz VARCHAR(60) NOT NULL,
    barrio VARCHAR(120) NOT NULL,
    stratum INTEGER NOT NULL,
    land_use VARCHAR(30) NOT NULL,
    area_m2 DOUBLE NOT NULL,
    cadastral_ref VARCHAR(60) NOT NULL,
    lat DOUBLE NOT NULL,
    lon DOUBLE NOT NULL,
    notes TEXT NOT NULL,
    source VARCHAR(240) NOT NULL,
    created_at VARCHAR(32) NOT NULL,
    updated_at VARCHAR(32) NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS localities (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    code VARCHAR(20) NOT NULL,
    mayor VARCHAR(160) NOT NULL,
    population INTEGER NOT NULL,
    area_ha DOUBLE NOT NULL,
    upz VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    lat DOUBLE NOT NULL,
    lon DOUBLE NOT NULL,
    bbox VARCHAR(120) NOT NULL,
    source VARCHAR(240) NOT NULL,
    created_at VARCHAR(32) NOT NULL,
    updated_at VARCHAR(32) NOT NULL
  )`,
];
