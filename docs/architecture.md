# Arquitectura y diagramas UML

## 1. Principios

- **Capas:** presentación (frontend) → exposición (API) → negocio/persistencia (backend).
- **SOLID:** puertos y adaptadores; el dominio no importa Express, `pg` ni `mysql2`.
- **Archivos ≤ 100 líneas:** verificado en CI.

| Principio | Dónde se ve |
| --- | --- |
| SRP | Un validador, un mapper, un repositorio por entidad |
| OCP | Nuevo motor = nuevo adaptador `Database`; nuevo recurso = nuevo spec + servicio |
| LSP | `SqlCrudRepository` y `InMemoryRepository` cumplen `Repository` |
| ISP | `ReadRepository` (solo lectura) vs `Repository` (CRUD) |
| DIP | `PlaceService` recibe `Repository`; `buildContext` inyecta SQLite/PG/MySQL |

## 2. Diagrama de despliegue (3 capas + ORM)

```mermaid
graph TB
  subgraph Cliente["Capa de presentación"]
    U[Usuario / navegador]
    FE["Frontend React + Vite + Leaflet<br/>Vercel · Netlify"]
  end

  subgraph Exposicion["Capa de exposición"]
    API["API REST /api/v1<br/>Node + Express · Render"]
  end

  subgraph Negocio["Capa de negocio y datos"]
    BE["Backend<br/>servicios + agente · Render/Docker"]
    ORM["Repositorios + adaptadores<br/>SqlCrudRepository"]
  end

  subgraph Datos["Persistencia"]
    PG[(PostgreSQL + PostGIS<br/>Neon / Supabase)]
    MY[(MySQL 8)]
    SL[(SQLite / SpatiaLite)]
  end

  U -->|HTTPS| FE
  FE -->|fetch JSON| API
  API -->|HTTP interno + x-admin-key| BE
  BE --> ORM
  ORM --> PG
  ORM -.-> MY
  ORM -.-> SL
```

## 3. Diagrama de componentes

```mermaid
graph LR
  subgraph Frontend
    Home[Home + SearchHero]
    Map[MapView Leaflet]
    Agent[AgentWidget]
    Admin[Admin CRUD]
  end

  subgraph API["la-floresta-sur-api"]
    Routes[routes/*.routes]
    Zod[schemas zod]
    Client[BackendClient]
  end

  subgraph Backend["la-floresta-sur-backend"]
    Svc[PlaceService · SecurityService · RoadService<br/>CadastralService · LocalityService]
    Search[SearchService]
    Stats[StatsService]
    Ag[AgentService]
    Repo[SqlCrudRepository + specs]
    Db[Database adapters]
  end

  Home --> Routes
  Map --> Routes
  Agent --> Routes
  Admin --> Routes
  Routes --> Zod
  Routes --> Client
  Client --> Svc
  Client --> Search
  Client --> Stats
  Client --> Ag
  Svc --> Repo
  Search --> Repo
  Stats --> Repo
  Ag --> Repo
  Repo --> Db
```

## 4. Diagrama de clases (SOLID)

```mermaid
classDiagram
  direction LR
  class ResourceService~T,TInput,F~ {
    <<interface>>
    +list(filters) Page~T~
    +get(id) T
    +create(input) T
    +update(id, patch) T
    +remove(id) void
  }

  class Repository~T,TInput,F~ {
    <<interface>>
    +list(filters) Page~T~
    +findById(id) T
    +create(input) T
    +update(id, patch) T
    +remove(id) bool
  }

  class ReadRepository~T,F~ {
    <<interface>>
    +list(filters) Page~T~
    +findById(id) T
  }

  class BaseCrudService~T,TInput,F~ {
    <<abstract>>
    #repo Repository
    +list() 
    +get(id)
    +create(input)
    +update(id, patch)
    #prepareCreate(input)*
    #preparePatch(patch, current)*
  }

  class PlaceService
  class SecurityService
  class SqlCrudRepository~T,TInput,F~ {
    #db Database
    #spec TableSpec
  }
  class InMemoryRepository
  class Database {
    <<interface>>
    +all(sql, params)
    +get(sql, params)
    +run(sql, params)
    +transaction(fn)
  }
  class SqliteDatabase
  class PostgresDatabase
  class MysqlDatabase
  class AgentService {
    +ask(question) AgentAnswer
  }

  ResourceService <|.. BaseCrudService
  BaseCrudService <|-- PlaceService
  BaseCrudService <|-- SecurityService
  Repository <|.. SqlCrudRepository
  Repository <|.. InMemoryRepository
  ReadRepository <|.. SqlCrudRepository
  SqlCrudRepository --> Database
  Database <|.. SqliteDatabase
  Database <|.. PostgresDatabase
  Database <|.. MysqlDatabase
  AgentService --> ReadRepository
```

## 5. Secuencia: búsqueda

```mermaid
sequenceDiagram
  actor U as Usuario
  participant FE as Frontend
  participant API as API
  participant BE as Backend
  participant DB as Base de datos

  U->>FE: escribe "veterinarias" + Enter
  FE->>API: GET /api/v1/search?q=veterinarias
  API->>API: valida q (zod)
  API->>BE: GET /internal/search?q=veterinarias
  BE->>DB: 5 consultas LIKE (places, incidents, roads, cadastral, localities)
  DB-->>BE: filas
  BE-->>API: hits uniformes + countsByCategory
  API-->>FE: 200 JSON
  FE-->>U: tarjetas + marcadores en el mapa
```

## 6. Secuencia: CRUD de un lugar

```mermaid
sequenceDiagram
  actor A as Administrador
  participant FE as Frontend /admin
  participant API as API
  participant BE as Backend
  participant DB as Postgres

  A->>FE: completa formulario y guarda
  FE->>API: POST /api/v1/places (x-admin-key)
  API->>API: zod + reglas (coordenadas, categoria)
  API->>BE: POST /internal/places
  BE->>BE: PlaceService.validatePlaceCreate
  BE->>DB: INSERT INTO places
  DB-->>BE: fila creada
  BE-->>API: 201 { data }
  API-->>FE: 201 { data }
  FE-->>A: tarjeta nueva + pin en el mapa
```

## 7. Secuencia: pregunta al agente de IA

```mermaid
sequenceDiagram
  actor U as Visitante
  participant W as AgentWidget
  participant API as API
  participant AG as AgentService
  participant R as Repositorios
  participant LLM as LLM (opcional)

  U->>W: "¿hay robos y cámaras cerca?"
  W->>API: POST /api/v1/agent/ask
  API->>AG: ask(question)
  AG->>AG: detectIntents() -> [seguridad, camaras]
  AG->>R: list() por categoria
  R-->>AG: registros reales
  alt LLM configurado
    AG->>LLM: contexto + pregunta
    LLM-->>AG: redaccion
  else sin clave
    AG->>AG: plantilla determinista
  end
  AG-->>API: answer + groups + suggestions
  API-->>W: 200 JSON
  W-->>U: respuesta con enlaces al mapa
```

## 8. Flujo de datos y despliegue

```text
git push -> GitHub Actions (check 100 líneas, tipos, tests, build)
         -> Render (Docker) backend + API
         -> Vercel/Netlify frontend
         -> Neon/Supabase PostgreSQL (o SQLite persistente en Render Disk)
```
