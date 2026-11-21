/** DDL del nucleo: categorias y lugares (compatible SQLite, PostgreSQL y MySQL). */
export const coreStatements: string[] = [
  `CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    slug VARCHAR(60) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    resource VARCHAR(40) NOT NULL,
    color VARCHAR(16) NOT NULL,
    icon VARCHAR(40) NOT NULL,
    description VARCHAR(400) NOT NULL,
    sort_order INTEGER NOT NULL,
    created_at VARCHAR(32) NOT NULL,
    updated_at VARCHAR(32) NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS places (
    id VARCHAR(36) PRIMARY KEY,
    category_slug VARCHAR(60) NOT NULL,
    name VARCHAR(160) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    address VARCHAR(240) NOT NULL,
    lat DOUBLE NOT NULL,
    lon DOUBLE NOT NULL,
    phone VARCHAR(60) NOT NULL,
    website VARCHAR(240) NOT NULL,
    hours VARCHAR(120) NOT NULL,
    metadata TEXT NOT NULL,
    source VARCHAR(240) NOT NULL,
    verified INTEGER NOT NULL,
    created_at VARCHAR(32) NOT NULL,
    updated_at VARCHAR(32) NOT NULL
  )`,
];
