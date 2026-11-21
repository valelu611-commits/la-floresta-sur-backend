# Plan y modelo de pruebas

## 1. Pirámide

| Nivel | Herramienta | Alcance |
| --- | --- | --- |
| Unitarias | Vitest | Servicios, validadores, intenciones del agente |
| Integración | Vitest + SQLite `:memory:` | Repositorios, migraciones, semillas, CRUD real |
| API | Vitest + Supertest (repo api) | Contratos, códigos HTTP, validación zod |
| Componentes | Vitest + Testing Library (repo frontend) | Buscador, tarjetas, chat del agente |

## 2. Casos del backend

| ID | Caso | Tipo | Archivo |
| --- | --- | --- | --- |
| B-01 | Crear lugar válido asigna id y defaults | Unitaria | `tests/unit/place-service.test.ts` |
| B-02 | Rechaza latitud fuera de Bogotá | Unitaria | idem |
| B-03 | Rechaza categoría que no es de lugares | Unitaria | idem |
| B-04 | PATCH conserva campos no enviados | Unitaria | idem |
| B-05 | `get`/`remove` de id inexistente → 404 | Unitaria | idem |
| B-06 | Borrado elimina el registro | Unitaria | idem |
| B-07 | Detecta intenciones por sinónimos y tildes | Unitaria | `tests/unit/agent-intents.test.ts` |
| B-08 | Cruza dos categorías en una pregunta | Unitaria | idem |
| B-09 | No inventa categoría si el tema es ajeno | Unitaria | idem |
| B-10 | Migra y siembra 13 categorías y >50 registros | Integración | `seed-and-filters.test.ts` |
| B-11 | Filtra por categoría y por `bbox` | Integración | idem |
| B-12 | Filtra severidad, condición vial, uso y localidad | Integración | idem |
| B-13 | Paginación sin duplicados | Integración | idem |
| B-14 | CRUD completo de lugar | Integración | `place-crud.test.ts` |
| B-15 | Validación de entrada al crear | Integración | idem |
| B-16 | CRUD de incidente + fecha inválida | Integración | idem |
| B-17 | Búsqueda transversal | Integración | `agent-search.test.ts` |
| B-18 | Consulta en blanco devuelve 0 | Integración | idem |
| B-19 | Agente responde con datos reales | Integración | idem |
| B-20 | Agente cruza categorías | Integración | idem |
| B-21 | Agente usa búsqueda libre sin intención | Integración | idem |
| B-22 | Agente rechaza pregunta corta | Integración | idem |

Ejecución: `npm test` · verificación completa: `npm run verify`.

## 3. Matriz funcional (manual/API)

| Escenario | Pasos | Resultado esperado |
| --- | --- | --- |
| Búsqueda inmediata | Abrir `/`, escribir "CAI" | Tarjetas y pines en < 2 s |
| Filtro geográfico | `GET /api/v1/places?bbox=-74.16,4.60,-74.14,4.62` | Solo lugares dentro de la caja |
| Crear | `POST /api/v1/places` con clave | `201` y pin nuevo |
| Sin clave | `POST` sin `x-admin-key` | `401 unauthorized` |
| Editar | `PATCH /api/v1/places/:id` | `200` con cambios y `updatedAt` nuevo |
| Borrar | `DELETE /api/v1/places/:id` | `204`, luego `404` |
| Categoría inválida | `POST` con `categorySlug=seguridad` | `400 validation_error` |
| Mapa | Abrir `/mapa`, activar capas | Marcadores por color de categoría |
| Agente | "¿qué transporte pasa?" | Respuesta con paraderos y estaciones |
| Multi-motor | `DB_ENGINE=postgres` + migrate + seed | Mismos resultados que SQLite |

## 4. Pruebas de regresión no funcionales

- `npm run check:size` falla si un archivo supera 100 líneas.
- `npm run typecheck` con `strict: true`.
- CI de GitHub Actions en cada push (Node 24).
- Verificación manual de contraste y navegación por teclado en el frontend.

## 5. Datos de prueba

Las pruebas de integración usan `DB_SQLITE_PATH=:memory:` y `SEED_ON_START=true`, por lo que
no tocan el archivo local ni requieren servicios externos.
