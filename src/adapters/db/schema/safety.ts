/** DDL de seguridad ciudadana y malla vial. */
export const safetyStatements: string[] = [
  `CREATE TABLE IF NOT EXISTS security_incidents (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    kind VARCHAR(60) NOT NULL,
    occurred_at VARCHAR(32) NOT NULL,
    time_range VARCHAR(40) NOT NULL,
    place_hint VARCHAR(180) NOT NULL,
    lat DOUBLE NOT NULL,
    lon DOUBLE NOT NULL,
    severity VARCHAR(12) NOT NULL,
    weapon VARCHAR(60) NOT NULL,
    description TEXT NOT NULL,
    source VARCHAR(240) NOT NULL,
    created_at VARCHAR(32) NOT NULL,
    updated_at VARCHAR(32) NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS road_segments (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    from_street VARCHAR(160) NOT NULL,
    to_street VARCHAR(160) NOT NULL,
    condition VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    length_m DOUBLE NOT NULL,
    lat DOUBLE NOT NULL,
    lon DOUBLE NOT NULL,
    geom_wkt TEXT NOT NULL,
    last_reported_at VARCHAR(32) NOT NULL,
    description TEXT NOT NULL,
    source VARCHAR(240) NOT NULL,
    created_at VARCHAR(32) NOT NULL,
    updated_at VARCHAR(32) NOT NULL
  )`,
];
