# Project CI - Gestor de Tareas Full Stack

Aplicacion web de gestion de tareas con arquitectura full stack containerizada con Docker.

## Tecnologias

| Capa       | Tecnologia                          | Contenedor          |
|------------|-------------------------------------|---------------------|
| Frontend   | React + TypeScript + Vite + Nginx   | project-ci-frontend |
| Backend    | Node.js + Express + TypeScript      | project-ci-backend  |
| Base Datos | PostgreSQL 16 Alpine                | project-ci-db       |

## Requisitos

- Docker
- Docker Compose

## Levantar el proyecto

```bash
docker-compose up --build
```

La aplicacion queda disponible en:
- Frontend: http://localhost
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/health

## Endpoints API

| Metodo | Ruta        | Descripcion                |
|--------|-------------|----------------------------|
| GET    | /health     | Estado del servidor        |
| GET    | /tasks      | Listar todas las tareas    |
| POST   | /tasks      | Crear tarea                |
| PUT    | /tasks/:id  | Actualizar estado de tarea |
| DELETE | /tasks/:id  | Eliminar tarea             |

## Arquitectura

```
Usuario (puerto 80)
      |
[FRONTEND - Nginx]   <- proxy /api/* -> http://backend:3000
      |
[BACKEND - Express]  <- DB_HOST=db
      |
[DATABASE - PostgreSQL]
```

Todos los contenedores comparten la red interna `ci-network`.
