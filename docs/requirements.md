# Modelo de requerimientos — La Floresta Sur

## 1. Alcance

Aplicación web pública para explorar y administrar información del barrio **La Floresta Sur**
(UPZ 79 Caldas, localidad 8 Kennedy, Bogotá). Tres repositorios: frontend, API y backend.

## 2. Actores

| Actor | Necesidad |
| --- | --- |
| Visitante | Buscar lugares, ver el mapa y preguntar al agente de IA sin registrarse |
| Administrador | Crear, editar y borrar registros de las 13 categorías |
| Sistema externo | Consumir la API REST pública (`GET`) |

## 3. Requerimientos funcionales

### RF-01 Búsqueda inmediata
Al entrar, el usuario ve una barra de búsqueda central con filtros rápidos.
Debe responder en menos de 2 s para el conjunto de datos del barrio.

### RF-02 Mapa interactivo
Mapa Leaflet centrado en La Floresta Sur con marcadores por categoría, popups con
nombre, dirección y datos de contacto, y control de capas.

### RF-03 Categorías (13)
El sistema modela, almacena, consulta y permite CRUD de:

| # | Categoría | Recurso | Tabla |
| --- | --- | --- | --- |
| 1 | Robos / seguridad ciudadana | `security-incidents` | `security_incidents` |
| 2 | Estado de calles / malla vial | `road-segments` | `road_segments` |
| 3 | Datos catastrales | `cadastral-properties` | `cadastral_properties` |
| 4 | Librerías | `places` (`librerias`) | `places` |
| 5 | CAI | `places` (`cai`) | `places` |
| 6 | Cámaras de seguridad | `places` (`camaras`) | `places` |
| 7 | Sitios de comida | `places` (`comida`) | `places` |
| 8 | Veterinarias | `places` (`veterinarias`) | `places` |
| 9 | Datos de la localidad | `localities` | `localities` |
| 10 | Zonas verdes / parques | `places` (`zonas-verdes`) | `places` |
| 11 | Transporte (TM/SITP/paraderos) | `places` (`transporte`) | `places` |
| 12 | Escenarios deportivos | `places` (`deportes`) | `places` |
| 13 | Centros educativos | `places` (`educacion`) | `places` |

### RF-04 CRUD completo
Crear, leer, actualizar y borrar en los cinco recursos, con validación de campos y
códigos HTTP coherentes (`201`, `200`, `204`, `400`, `404`, `401`).

### RF-05 Filtros
- Texto libre (`q`) sobre nombre, dirección y descripción.
- Filtro por categoría, severidad, tipo de hurto, estado/condición vial, estrato, uso del suelo.
- Filtro geográfico `bbox=minLon,minLat,maxLon,maxLat`.
- Paginación con `limit` (máx. 100) y `offset`.

### RF-06 Agente de IA
Botón flotante en todas las vistas. Recibe preguntas en lenguaje natural, detecta una o
varias categorías, recupera registros reales y responde; opcionalmente redacta con un LLM.
Debe funcionar sin clave de LLM (modo determinista).

### RF-07 Administración protegida
Las escrituras exigen `x-admin-key`; las lecturas son públicas.

### RF-08 Contexto de localidad
Ficha de Kennedy y de La Floresta Sur con UPZ, población aproximada y bounding box.

## 4. Requerimientos no funcionales

| ID | Requerimiento | Verificación |
| --- | --- | --- |
| RNF-01 | Cada archivo de código ≤ 100 líneas | `npm run check:size` en CI |
| RNF-02 | SOLID explícito (SRP, OCP, LSP, ISP, DIP) | Revisión + puertos/adaptadores |
| RNF-03 | Multi-motor: PostgreSQL/PostGIS, MySQL, SQLite/SpatiaLite | Adaptadores + scripts `db/` |
| RNF-04 | Disponibilidad pública | Despliegue documentado en `docs/deployment.md` |
| RNF-05 | Seguridad de entrada | Validación de tipos, rangos, coordenadas y longitud |
| RNF-06 | Rendimiento | Índices por categoría, fecha y geografía; paginación |
| RNF-07 | Accesibilidad y responsive | Contraste AA, navegación por teclado, móvil |
| RNF-08 | Observabilidad | `/internal/health`, logs de error, `SEED_ON_START` |
| RNF-09 | Reproducibilidad | Docker + `npm ci` + CI en GitHub Actions |
| RNF-10 | Datos honestos | Semillas marcadas como ejemplo, con `source` |

## 5. Fuera de alcance (v1)

- Autenticación de usuarios finales (solo clave de administración).
- Denuncias formales ante la Policía.
- Histórico oficial validado; las semillas son ilustrativas.
