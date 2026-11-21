-- PostGIS: se ejecuta una sola vez al crear el contenedor (docker-entrypoint-initdb.d)
CREATE EXTENSION IF NOT EXISTS postgis;
