-- PostGIS: ejecutar DESPUES de `npm run db:migrate` (agrega columnas espaciales nativas).
-- psql "$DATABASE_URL" -f db/postgres/02-geometry.sql

ALTER TABLE places ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);
ALTER TABLE security_incidents ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);
ALTER TABLE road_segments ADD COLUMN IF NOT EXISTS geom geometry(LineString, 4326);
ALTER TABLE cadastral_properties ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);

UPDATE places SET geom = ST_SetSRID(ST_MakePoint(lon, lat), 4326) WHERE geom IS NULL;
UPDATE security_incidents SET geom = ST_SetSRID(ST_MakePoint(lon, lat), 4326) WHERE geom IS NULL;
UPDATE cadastral_properties SET geom = ST_SetSRID(ST_MakePoint(lon, lat), 4326) WHERE geom IS NULL;
UPDATE road_segments
   SET geom = ST_GeomFromText(geom_wkt, 4326)
 WHERE geom IS NULL AND geom_wkt LIKE 'LINESTRING%';

CREATE INDEX IF NOT EXISTS idx_places_geom ON places USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_incidents_geom ON security_incidents USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_roads_geom ON road_segments USING GIST (geom);

-- Ejemplo de consulta espacial (vecindad de 300 m):
-- SELECT name, ST_Distance(geom::geography, ST_MakePoint(-74.1508, 4.6112)::geography) AS metros
--   FROM places WHERE category_slug = 'veterinarias'
--   AND ST_DWithin(geom::geography, ST_MakePoint(-74.1508, 4.6112)::geography, 300)
--   ORDER BY metros;
