# Guía de despliegue público

Objetivo: que **cualquier persona entre desde internet**, no solo en `localhost`.
Arquitectura recomendada: frontend en Vercel/Netlify, API y backend en Render,
base de datos en Neon (PostgreSQL) o SQLite persistente.

## 0. Orden de despliegue

1. Base de datos (Neon o Render Postgres).
2. Backend (Render, Docker).
3. API (Render, Node).
4. Frontend (Vercel o Netlify).

Guarda las URLs: las necesitarás en las variables de entorno del siguiente servicio.

## 1. Base de datos en Neon (gratis)

1. Crea una cuenta en <https://neon.tech> y un proyecto `la-floresta-sur` en la región
   `AWS us-east-2` (cercana a Render Oregon).
2. Copia la cadena **Pooled connection string**, similar a:
   `postgresql://user:pass@ep-xxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require`
3. No necesitas crear tablas: el backend migra y siembra al arrancar (`SEED_ON_START=true`).
4. (Opcional, geometrías nativas) Con `psql`:
   ```bash
   psql "$DATABASE_URL" -f db/postgres/02-geometry.sql
   ```

> Alternativa sin Postgres: `DB_ENGINE=sqlite` + Render Disk montado en `/app/data`.
> Es la opción más barata, pero el disco gratuito de Render no está disponible en todos los planes.

## 2. Backend en Render (Docker)

1. <https://dashboard.render.com> → **New** → **Web Service** → conecta
   `valelu611-commits/la-floresta-sur-backend`.
2. Runtime: **Docker** (detecta el `Dockerfile`). Plan: **Free**.
3. Región: `Oregon`. Health check: `/internal/health`.
4. Variables de entorno:

   | Clave | Valor |
   | --- | --- |
   | `DB_ENGINE` | `postgres` |
   | `DATABASE_URL` | cadena de Neon |
   | `DB_SSL` | `true` |
   | `ADMIN_API_KEY` | clave larga aleatoria (guardarla) |
   | `SEED_ON_START` | `true` |
   | `CORS_ORIGINS` | `*` |
   | `LLM_PROVIDER` / `LLM_API_KEY` | opcional |

5. Deploy. Verifica: `https://<servicio>.onrender.com/internal/health` → `{"status":"ok"}`.

> En el plan free el servicio duerme tras 15 min sin tráfico; el primer request tarda ~30 s.

## 3. API en Render (Node)

1. **New** → **Web Service** → repo `la-floresta-sur-api`. Runtime **Node**, plan Free.
2. Build: `npm ci && npm run build` · Start: `npm start` · Health: `/health`.
3. Variables:

   | Clave | Valor |
   | --- | --- |
   | `BACKEND_URL` | `https://<backend>.onrender.com` |
   | `ADMIN_API_KEY` | **la misma** del backend |
   | `CORS_ORIGINS` | `*` (o la URL del frontend) |
   | `PORT` | Render lo inyecta |

4. Verifica `https://<api>.onrender.com/api/v1/health` y `/api/v1/stats`.

## 4. Frontend en Vercel (gratis)

1. <https://vercel.com/new> → importa `la-floresta-sur`.
2. Framework: **Vite**. Build: `npm run build`. Output: `dist`.
3. Variable de entorno:
   `VITE_API_URL=https://<api>.onrender.com/api/v1`
4. Deploy y abre la URL pública. El mapa y el agente deben funcionar.

### Alternativa Netlify

`netlify.toml` ya está incluido (`npm run build`, publish `dist`).
Agrega `VITE_API_URL` en *Site settings → Environment variables*.

## 5. Docker local (simula producción)

```bash
# backend + PostgreSQL/PostGIS
docker compose up --build
# API
cd ../la-floresta-sur-api && docker compose up --build
# frontend
cd ../la-floresta-sur && docker compose up --build
```

## 6. Checklist de publicación

- [ ] `/internal/health` y `/api/v1/health` responden `ok`.
- [ ] `/api/v1/stats` devuelve 13 categorías.
- [ ] Crear un lugar con `x-admin-key` responde `201`.
- [ ] Sin clave responde `401`.
- [ ] La portada carga la búsqueda y el mapa con pines.
- [ ] El agente responde una pregunta cruzada.
- [ ] CI en verde en los tres repositorios.
- [ ] `ADMIN_API_KEY` distinta de la de ejemplo.

## 7. Costos y límites (referencia)

| Servicio | Plan free | Nota |
| --- | --- | --- |
| Render Web | 750 h/mes, duerme | Suficiente para demo |
| Neon | 0.5 GB | PostgreSQL + PostGIS disponible |
| Vercel | 100 GB banda | Frontend estático |
| GitHub Actions | 2000 min/mes | CI de los 3 repos |
