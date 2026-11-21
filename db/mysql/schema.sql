-- MySQL 8: esquema completo con indices y charset utf8mb4.
-- mysql -u root -p < db/mysql/schema.sql

CREATE DATABASE IF NOT EXISTS lafloresta
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lafloresta;

CREATE TABLE IF NOT EXISTS categories (
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
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS places (
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
  updated_at VARCHAR(32) NOT NULL,
  INDEX idx_places_category (category_slug),
  INDEX idx_places_geo (lat, lon)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS security_incidents (
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
  updated_at VARCHAR(32) NOT NULL,
  INDEX idx_incidents_kind (kind, severity)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS road_segments (
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
  updated_at VARCHAR(32) NOT NULL,
  INDEX idx_roads_condition (condition, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cadastral_properties (
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
  updated_at VARCHAR(32) NOT NULL,
  INDEX idx_cadastral_upz (upz, stratum)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS localities (
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
) ENGINE=InnoDB;
