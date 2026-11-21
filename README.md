# la-floresta-sur-backend

Núcleo del sistema **La Floresta Sur** (UPZ 79 Caldas, localidad de Kennedy, Bogotá).
Aquí viven el **modelo de dominio, las reglas de negocio, los servicios, el ORM y los
adaptadores de base de datos** para PostgreSQL/PostGIS, MySQL y SQLite/SpatiaLite.

> Este servicio es interno: lo consume `la-floresta-sur-api`. No se expone directo a internet.

## Rol en la arquitectura de 3 capas

```text
Frontend (React + Leaflet)  ->  API REST pública  ->  Backend (dominio + ORM)  ->  PostgreSQL / MySQL / SQLite
```

## Stack

- Node.js 24 + TypeScript (ESM)
- Express 4 (servicio interno)
- `pg` (PostgreSQL/PostGIS), `mysql2`, `node:sqlite` (sin binarios nativos)
- Vitest para pruebas
- Docker multi-stage + Render

## Estructura

```text
src/
  domain/          entidades, errores, constantes, puertos (Repository, Database, Service)
  services/        casos de uso CRUD, validacion, busqueda, estadisticas
  agent/           agente de IA (reglas + LLM opcional)
  adapters/db/     implementaciones SQL y adaptadores por motor
  seed/            datos realistas de ejemplo (13 categorias)
  http/            servicio HTTP interno
  cli/             migraciones y semillas
docs/              requerimientos, especificacion, UML, pruebas y despliegue
db/                scripts PostGIS, SpatiaLite y MySQL
tests/             pruebas unitarias e integracion
```

## Inicio rápido

```bash
npm install
cp .env.example .env          # en Windows: copy .env.example .env
npm run db:migrate
npm run db:seed
npm run dev                   # http://localhost:4000/internal/health
```

La base por defecto es SQLite (`./data/la-floresta-sur.sqlite`), así que no necesitas
instalar nada para empezar.

### PostgreSQL / PostGIS

```bash
docker compose up -d db
# en .env
DB_ENGINE=postgres
DATABASE_URL=postgres://floresta:floresta_dev@localhost:5432/lafloresta
DB_SSL=false
npm run db:migrate
psql "$DATABASE_URL" -f db/postgres/02-geometry.sql   # columnas e indices espaciales
npm run db:seed
```

### MySQL 8

```bash
mysql -u root -p < db/mysql/schema.sql
# .env: DB_ENGINE=mysql  DATABASE_URL=mysql://user:pass@host:3306/lafloresta
npm run db:migrate && npm run db:seed
```

### SpatiaLite

```bash
npm run db:migrate
spatialite data/la-floresta-sur.sqlite < db/spatialite/geometry.sql
```

## Variables de entorno

| Variable | Ejemplo | Descripción |
| --- | --- | --- |
| `PORT` | `4000` | Puerto del servicio interno |
| `DB_ENGINE` | `sqlite` / `postgres` / `mysql` | Motor activo |
| `DB_SQLITE_PATH` | `./data/lfs.sqlite` | Archivo SQLite (`:memory:` en pruebas) |
| `DATABASE_URL` | `postgres://...` | Cadena de conexión para PG/MySQL |
| `DB_SSL` | `true` | SSL para PostgreSQL gestionado (Neon, Supabase) |
| `ADMIN_API_KEY` | `clave-larga` | Clave de escritura compartida con la API |
| `CORS_ORIGINS` | `*` | Orígenes permitidos |
| `SEED_ON_START` | `true` | Carga semillas al arrancar (útil en demo) |
| `LLM_PROVIDER` | `openai` | Activa respuestas con LLM (opcional) |
| `LLM_API_KEY` | `sk-...` | Clave del proveedor compatible con OpenAI |
| `LLM_MODEL` | `gpt-4o-mini` | Modelo a usar |

## Endpoints internos

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/internal/health` | Estado y motor activo |
| GET | `/internal/categories` | Las 13 categorías |
| GET | `/internal/stats` | Conteo por categoría |
| GET | `/internal/search?q=` | Búsqueda transversal |
| POST | `/internal/agent/ask` | Pregunta en lenguaje natural |
| GET | `/internal/{recurso}` | Listado con filtros y paginación |
| GET | `/internal/{recurso}/:id` | Detalle |
| POST | `/internal/{recurso}` | Crear (requiere `x-admin-key`) |
| PATCH | `/internal/{recurso}/:id` | Actualizar (requiere `x-admin-key`) |
| DELETE | `/internal/{recurso}/:id` | Borrar (requiere `x-admin-key`) |

Recursos: `places`, `security-incidents`, `road-segments`, `cadastral-properties`, `localities`.

## Pruebas

```bash
npm run verify        # 100 líneas + tipos + 24 pruebas
npm test
npm run check:size
```

Cobertura de pruebas: [`docs/test-plan.md`](docs/test-plan.md).

## Documentación

- [Requerimientos](docs/requirements.md)
- [Especificación y contratos](docs/specification.md)
- [Arquitectura y UML](docs/architecture.md)
- [Plan de pruebas](docs/test-plan.md)
- [Despliegue público](docs/deployment.md)

## Reglas del proyecto

- Máximo **100 líneas** por archivo de código (`npm run check:size`, también en CI).
- SOLID aplicado con puertos (`Repository`, `Database`, `ResourceService`) y adaptadores.
- CRUD completo en los 5 recursos, con validación de coordenadas dentro de Bogotá.

## Aviso sobre los datos

Las semillas son **datos de ejemplo** con direcciones y coordenadas aproximadas, pensadas
para demostrar el sistema. No sustituyen fuentes oficiales (Policía, Catastro, IDU, TransMilenio).

## Licencia

MIT.
