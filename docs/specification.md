# Especificación técnica

## 1. Modelo de datos

Todas las tablas comparten `id VARCHAR(36)`, `created_at VARCHAR(32)` y `updated_at VARCHAR(32)`
(ISO-8601). Los tipos son portables entre SQLite, PostgreSQL y MySQL.

### `categories`
`id`, `slug` (único), `name`, `resource`, `color`, `icon`, `description`, `sort_order`.

`resource` ∈ `places | security-incidents | road-segments | cadastral-properties | localities`.

### `places` (9 categorías)
`category_slug`, `name`, `description`, `address`, `lat`, `lon`, `phone`, `website`,
`hours`, `metadata` (JSON serializado), `source`, `verified`.

`category_slug` ∈ `librerias, cai, camaras, comida, veterinarias, zonas-verdes, transporte, deportes, educacion`.

### `security_incidents`
`title`, `kind`, `occurred_at` (ISO), `time_range`, `place_hint`, `lat`, `lon`,
`severity` (`baja|media|alta`), `weapon`, `description`, `source`.

`kind` ∈ `hurto_persona, hurto_residencia, hurto_comercio, hurto_bicicleta, hurto_moto,
hurto_celular, vandalismo, rina, otro`.

### `road_segments`
`name`, `from_street`, `to_street`, `condition` (`bueno|regular|deteriorado`),
`status` (`transitable|obras|cerrada`), `length_m`, `lat`, `lon`, `geom_wkt`,
`last_reported_at`, `description`, `source`.

### `cadastral_properties`
`address`, `upz`, `barrio`, `stratum` (1–6), `land_use` (`residencial|comercial|mixto|
institucional|dotacional`), `area_m2`, `cadastral_ref`, `lat`, `lon`, `notes`, `source`.

### `localities`
`name`, `code`, `mayor`, `population`, `area_ha`, `upz`, `description`, `lat`, `lon`,
`bbox` (`minLon,minLat,maxLon,maxLat`), `source`.

## 2. Contratos REST (los expone `la-floresta-sur-api`)

### Lecturas públicas

```http
GET /api/v1/stats
200 { "barrio": "La Floresta Sur", "center": {...}, "totalRecords": 75,
      "categories": [{ "slug": "cai", "name": "CAI", "color": "#3B82F6", "count": 3 }] }

GET /api/v1/places?q=veterinaria&category=veterinarias&bbox=-74.16,4.60,-74.14,4.62&limit=20&offset=0
200 { "data": [ { "id": "...", "name": "...", "lat": 4.61, "lon": -74.15 } ],
      "meta": { "total": 4, "limit": 20, "offset": 0 } }

GET /api/v1/places/:id        -> 200 { "data": {...} } | 404
GET /api/v1/categories        -> 200 { "data": [...] }
GET /api/v1/search?q=parque   -> 200 { "query": "parque", "total": 6, "hits": [...] }
POST /api/v1/agent/ask        -> 200 { "answer": "...", "intents": ["cai"], "groups": [...] }
```

### Escrituras (requieren `x-admin-key`)

```http
POST   /api/v1/places          201 { "data": {...} }
PATCH  /api/v1/places/:id      200 { "data": {...} }
DELETE /api/v1/places/:id      204
```

Recursos: `places`, `security-incidents`, `road-segments`, `cadastral-properties`, `localities`.

### Error estándar

```json
{ "error": { "code": "validation_error", "message": "lat debe estar entre 4.45 y 4.84" } }
```

| Código | Uso |
| --- | --- |
| `validation_error` | Entrada inválida (400) |
| `unauthorized` | Falta o no coincide `x-admin-key` (401) |
| `not_found` | Recurso inexistente (404) |
| `internal_error` | Fallo no controlado (500) |

## 3. Reglas de negocio

1. `lat` y `lon` deben caer dentro de Bogotá (`4.45..4.84`, `-74.25..-74.00`).
2. `categorySlug` de un lugar debe pertenecer a las 9 categorías de lugares.
3. `stratum` entre 1 y 6; `areaM2` entre 1 y 500 000.
4. `occurredAt` debe ser ISO (`YYYY-MM-DD...`).
5. `limit` se normaliza a 1..100; `offset` ≥ 0.
6. En PATCH, la entidad se valida **completa** (entidad actual + parche) antes de escribir.
7. Borrar exige que el recurso exista (si no, 404).
8. El agente nunca inventa: si no hay registros, lo dice explícitamente.

## 4. Soporte multi-base de datos

| Motor | Adaptador | Driver | Notas |
| --- | --- | --- | --- |
| PostgreSQL + PostGIS | `PostgresDatabase` | `pg` | Traduce `?` a `$1..$n`; SSL configurable |
| MySQL 8 / MariaDB | `MysqlDatabase` | `mysql2` | `?` nativo; `affectedRows` |
| SQLite / SpatiaLite | `SqliteDatabase` | `node:sqlite` | Sin binarios nativos; WAL |

El dominio solo conoce el puerto `Database` (5 operaciones) y el puerto `Repository<T, TInput, F>`.
Cambiar de motor no toca servicios ni rutas.

### Geometrías nativas

- PostGIS: `db/postgres/02-geometry.sql` agrega columnas `geometry(Point|LineString,4326)`,
  las rellena desde `lat/lon` y `geom_wkt`, y crea índices GIST.
- SpatiaLite: `db/spatialite/geometry.sql` usa `AddGeometryColumn`, `MakePoint` y
  `CreateSpatialIndex`.
- MySQL: `db/mysql/schema.sql` mantiene `lat/lon` y recomienda `POINT SRID 4326` + índice
  `SPATIAL` si se necesita (MySQL exige columnas NOT NULL).

## 5. Semillas

`src/seed/` contiene 13 categorías, 35 lugares, 9 incidentes, 8 tramos viales, 8 predios y
2 fichas de localidad (75 registros). Cada registro incluye `source` para trazabilidad.
