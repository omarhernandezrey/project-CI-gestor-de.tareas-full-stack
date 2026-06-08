# Project CI — Gestor de Tareas Full Stack

Aplicación web de gestión de tareas con arquitectura **full stack containerizada** e
**integración continua (CI)** mediante Docker y Jenkins.

Este repositorio cubre dos entregas del curso de Integración Continua:

| Entrega | Semana | Tema | Estado |
|---------|--------|------|--------|
| **Entrega 1** | 3 | Containerización con Docker (3 contenedores comunicados) | ✅ |
| **Entrega 2** | 5 | Integración continua con Jenkins | ✅ |

---

## Tabla de contenidos

1. [Tecnologías](#tecnologías)
2. [Arquitectura](#arquitectura)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Requisitos previos](#requisitos-previos)
5. [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
6. [Variables de entorno](#variables-de-entorno)
7. [API REST](#api-rest)
8. [Entrega 1 — Docker](#entrega-1--docker-semana-3)
9. [Entrega 2 — Jenkins (CI)](#entrega-2--jenkins-ci-semana-5)
10. [Comandos útiles](#comandos-útiles)
11. [Solución de problemas](#solución-de-problemas)

---

## Tecnologías

| Capa        | Tecnología                          | Contenedor            | Puerto |
|-------------|-------------------------------------|-----------------------|--------|
| Frontend    | React + TypeScript + Vite + Nginx   | `project-ci-frontend` | 80     |
| Backend     | Node.js + Express + TypeScript      | `project-ci-backend`  | 3000   |
| Base de datos | PostgreSQL 16 Alpine              | `project-ci-db`       | 5432   |
| CI / CD     | Jenkins LTS + Docker CLI + Compose  | `project-ci-jenkins`  | 8080   |

---

## Arquitectura

Todos los servicios viven en una red Docker interna llamada **`ci-network`**, lo que
les permite comunicarse entre sí por su nombre de contenedor (DNS interno de Docker).

```
   ┌────────────────────────────────────────────────────────────────────────┐
   │                        RED DOCKER  ·  ci-network                         │
   └────────────────────────────────────────────────────────────────────────┘

        ┌─────────────────┐    ──── /api/* ────►    ┌─────────────────┐
        │    FRONTEND      │       (proxy nginx)     │     BACKEND      │
        │  React · Nginx   │                         │  Node · Express  │
        │       :80        │                         │      :3000       │
        └─────────────────┘                         └────────┬────────┘
                                                              │ DB_HOST=db
                                                              ▼
        ┌─────────────────┐                         ┌─────────────────┐
        │     JENKINS      │                         │   POSTGRESQL     │
        │     CI / CD      │                         │      :5432       │
        │  :8080 · :50000  │                         │  (volumen PV)    │
        └────────┬────────┘                         └─────────────────┘
                 │ docker.sock
                 ▼
        /var/run/docker.sock  ──►  construye y despliega  frontend · backend · db
        (Docker Engine del host)
```

**Puntos de acceso (host → servicio):**

| URL del host            | Servicio        | Contenedor            |
|-------------------------|-----------------|-----------------------|
| `http://localhost`      | Frontend (app)  | `project-ci-frontend` |
| `http://localhost:3000` | Backend API     | `project-ci-backend`  |
| `http://localhost:8080` | Jenkins (CI)    | `project-ci-jenkins`  |
| `localhost:5432`        | PostgreSQL      | `project-ci-db`       |

**Flujo de una petición del usuario:**

1. El navegador pide `http://localhost` → **Nginx (frontend)** sirve la SPA de React.
2. La app llama a `/api/tasks` → Nginx hace **proxy** a `http://backend:3000/tasks`.
3. El **backend** consulta a **PostgreSQL** usando el host `db`.
4. La respuesta viaja de vuelta: DB → backend → nginx → navegador.

---

## Estructura del proyecto

```
project-CI-gestor-de.tareas-full-stack/
├── docker-compose.yml        # Orquestación de los 4 servicios
├── Jenkinsfile               # Pipeline de integración continua
├── .env.example              # Plantilla de variables de entorno
├── README.md
│
├── backend/                  # API REST (Node + Express + TypeScript)
│   ├── Dockerfile            # Build multi-stage (npm ci)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts          # Endpoints y servidor Express
│       └── db/connection.ts  # Conexión a PostgreSQL + init de tabla
│
├── frontend/                 # SPA (React + Vite + TypeScript)
│   ├── Dockerfile            # Build multi-stage → Nginx
│   ├── nginx.conf            # Reverse proxy /api → backend
│   ├── package.json
│   └── src/
│       ├── App.tsx           # UI del gestor de tareas
│       └── main.tsx
│
└── jenkins/                  # Imagen de CI
    └── Dockerfile            # Jenkins LTS + Docker CLI + Compose + curl
```

---

## Requisitos previos

- **Docker** 20.10 o superior
- **Docker Compose v2** (incluido en Docker Desktop / `docker compose`)
- Git

Verifica tu instalación:

```bash
docker --version
docker compose version
```

---

## Cómo ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/omarhernandezrey/project-CI-gestor-de.tareas-full-stack.git
cd project-CI-gestor-de.tareas-full-stack
```

### 2. (Opcional) Configurar variables de entorno

```bash
cp .env.example .env
```

> Si omites este paso, el proyecto usa valores por defecto y funciona igual.

### 3. Levantar todo el stack

```bash
docker compose up --build -d
```

Esto construye y levanta los **4 contenedores**: `jenkins`, `frontend`, `backend` y `db`.

### 4. Verificar que los contenedores están activos

```bash
docker ps
```

Deberías ver: `project-ci-jenkins`, `project-ci-frontend`, `project-ci-backend`, `project-ci-db`.

### 5. Acceder a la aplicación

| Servicio          | URL                              |
|-------------------|----------------------------------|
| Frontend (app)    | http://localhost                 |
| Backend API       | http://localhost:3000            |
| Health check      | http://localhost:3000/health     |
| Jenkins (CI)      | http://localhost:8080            |

### 6. Detener el proyecto

```bash
docker compose down            # detiene y elimina contenedores
docker compose down -v         # además borra los volúmenes (datos de la BD)
```

---

## Variables de entorno

Definidas en `.env` (a partir de `.env.example`). El `docker-compose.yml` las inyecta
con valores por defecto, de modo que el proyecto funciona aun sin crear el archivo.

| Variable      | Por defecto  | Descripción                          |
|---------------|--------------|--------------------------------------|
| `DB_HOST`     | `db`         | Host de la base de datos (nombre del servicio) |
| `DB_PORT`     | `5432`       | Puerto de PostgreSQL                 |
| `DB_USER`     | `postgres`   | Usuario de la base de datos          |
| `DB_PASSWORD` | `postgres123`| Contraseña de la base de datos       |
| `DB_NAME`     | `project_ci` | Nombre de la base de datos           |

> El archivo `.env` está en `.gitignore` y **no se versiona** (buena práctica de seguridad).

---

## API REST

Base URL: `http://localhost:3000` (o vía proxy `http://localhost/api`)

| Método | Ruta          | Descripción                  | Body                         |
|--------|---------------|------------------------------|------------------------------|
| GET    | `/`           | Mensaje de bienvenida        | —                            |
| GET    | `/health`     | Estado del servidor          | —                            |
| GET    | `/tasks`      | Listar todas las tareas      | —                            |
| POST   | `/tasks`      | Crear una tarea              | `{ "title": "string" }`      |
| PUT    | `/tasks/:id`  | Actualizar estado de tarea   | `{ "completed": boolean }`   |
| DELETE | `/tasks/:id`  | Eliminar una tarea           | —                            |

**Ejemplos:**

```bash
# Health check
curl http://localhost:3000/health

# Crear una tarea
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Mi primera tarea"}'

# Listar tareas
curl http://localhost:3000/tasks
```

---

## Entrega 1 — Docker (Semana 3)

**Objetivo:** containerizar la aplicación en contenedores comunicados entre sí.

### Cumplimiento

- ✅ **Tres contenedores**: `frontend`, `backend`, `db`.
- ✅ **Comunicación entre ellos** a través de la red `ci-network`:
  - Frontend → Backend mediante reverse proxy de Nginx (`/api` → `http://backend:3000`).
  - Backend → Base de datos mediante el host `db`.
- ✅ **Builds multi-stage** en backend y frontend → imágenes finales ligeras.
- ✅ **Instalación reproducible** con `npm ci` y `package-lock.json`.
- ✅ **Healthcheck** en PostgreSQL + `depends_on: condition: service_healthy` → arranque ordenado.

### Verificar la comunicación entre contenedores

```bash
# El frontend (puerto 80) hace proxy al backend
curl http://localhost/api/health

# El backend (puerto 3000) consulta la base de datos
curl -X POST http://localhost/api/tasks -H "Content-Type: application/json" -d '{"title":"prueba"}'
curl http://localhost:3000/tasks
```

---

## Entrega 2 — Jenkins (CI) (Semana 5)

**Objetivo:** implementar Jenkins como gestor de integración continua.

### Características de la implementación

- **Imagen personalizada** (`jenkins/Dockerfile`): parte de `jenkins/jenkins:lts` y añade
  `docker-ce-cli`, `docker-compose-plugin` y `curl` (la imagen oficial no los trae).
- **Acceso al demonio Docker**: se monta `/var/run/docker.sock` para que Jenkins pueda
  construir y administrar los contenedores de la app (patrón *Docker-out-of-Docker*).
- **Persistencia**: volumen `jenkins-data` en `/var/jenkins_home`.
- **Red compartida**: Jenkins está en `ci-network`, por lo que alcanza el backend por su
  nombre (`http://project-ci-backend:3000`) durante las pruebas.

### Pipeline (`Jenkinsfile`)

| Etapa     | Acción                                                              |
|-----------|---------------------------------------------------------------------|
| Checkout  | Descarga el código desde GitHub                                     |
| Build     | `docker compose build frontend backend db`                          |
| Deploy    | Levanta los contenedores y espera a que el backend esté saludable   |
| Test      | Pruebas funcionales: `GET /health` y `GET /tasks`                   |

Si una etapa falla, el bloque `post { failure }` detiene los contenedores y reporta el error.

### Configurar Jenkins (primera vez)

1. Levantar el stack:

   ```bash
   docker compose up --build -d
   ```

2. Obtener la contraseña inicial:

   ```bash
   docker exec project-ci-jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```

3. Abrir `http://localhost:8080`, pegar la contraseña, instalar los plugins sugeridos y
   crear el usuario administrador.

4. Crear el job:
   - **New Item → Pipeline** (nombre: `project-ci-pipeline`).
   - *Pipeline → Definition*: **Pipeline script from SCM**.
   - **SCM**: Git → URL del repositorio → rama `main`.
   - **Script Path**: `Jenkinsfile`.
   - Guardar.

5. Clic en **Build Now**. Jenkins descarga, construye, despliega y prueba la app
   automáticamente.

---

## Comandos útiles

```bash
# Ver estado de los contenedores
docker ps

# Ver logs de un servicio
docker compose logs -f backend

# Reconstruir un servicio específico sin caché
docker compose build --no-cache backend

# Reiniciar un servicio
docker compose restart backend

# Entrar a un contenedor
docker exec -it project-ci-backend sh

# Validar la sintaxis del docker-compose
docker compose config

# Detener y limpiar todo (incluye datos)
docker compose down -v
```

---

## Solución de problemas

| Problema | Causa | Solución |
|----------|-------|----------|
| `network ci-network not found` | La red aún no existe | Se crea automáticamente con `docker compose up`; o `docker network create ci-network` |
| `Conflict. The container name is already in use` | Un contenedor previo quedó activo | `docker rm -f project-ci-backend` y vuelve a levantar |
| `port is already allocated` | Otro proceso usa el puerto (80, 3000, 5432, 8080) | Libera el puerto o cambia el mapeo en `docker-compose.yml` |
| Backend no conecta a la BD | La BD aún no está lista | El backend reintenta automáticamente; verifica con `docker compose logs db` |
| Jenkins: `docker-compose: not found` | Imagen sin Compose | Resuelto: la imagen personalizada incluye `docker-compose-plugin` y se usa `docker compose` |

---

## Autor

**Omar Hernández Rey** — [github.com/omarhernandezrey](https://github.com/omarhernandezrey)
