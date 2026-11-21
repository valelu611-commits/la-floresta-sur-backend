-- SpatiaLite: ejecutar con la CLI `spatialite` sobre el archivo SQLite.
-- spatialite data/la-floresta-sur.sqlite < db/spatialite/geometry.sql
-- Requiere la extension mod_spatialite instalada en el sistema.

SELECT InitSpatialMetaData(1);

SELECT AddGeometryColumn('places', 'geom', 4326, 'POINT', 'XY');
SELECT AddGeometryColumn('security_incidents', 'geom', 4326, 'POINT', 'XY');
SELECT AddGeometryColumn('road_segments', 'geom', 4326, 'LINESTRING', 'XY');
SELECT AddGeometryColumn('cadastral_properties', 'geom', 4326, 'POINT', 'XY');

UPDATE places SET geom = MakePoint(lon, lat, 4326) WHERE geom IS NULL;
UPDATE security_incidents SET geom = MakePoint(lon, lat, 4326) WHERE geom IS NULL;
UPDATE cadastral_properties SET geom = MakePoint(lon, lat, 4326) WHERE geom IS NULL;
UPDATE road_segments SET geom = GeomFromText(geom_wkt, 4326)
 WHERE geom IS NULL AND geom_wkt LIKE 'LINESTRING%';

SELECT CreateSpatialIndex('places', 'geom');
SELECT CreateSpatialIndex('security_incidents', 'geom');
SELECT CreateSpatialIndex('road_segments', 'geom');

-- Consulta de vecindad (300 m):
-- SELECT name FROM places
--  WHERE category_slug = 'veterinarias'
--    AND ST_Distance(geom, MakePoint(-74.1508, 4.6112, 4326)) < 0.003;
