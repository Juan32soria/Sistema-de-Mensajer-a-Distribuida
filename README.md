# GroupsApp — Mensajería por Microservicios

Aplicación de chat en tiempo real similar a WhatsApp/Discord. Permite registro de usuarios, creación de grupos y canales, mensajes privados y archivos adjuntos almacenados en S3.

## Arquitectura

```
Navegador
    │
    ▼
Nginx  ──→  /api/auth/      →  auth-service     (Django + JWT)
            /api/groups/    →  groups-service   (Django)
            /api/messages/  →  messages-service (Django + S3)
            /               →  React (build estático)

Cada servicio tiene su propia base de datos PostgreSQL.
```

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 18 · Vite · Tailwind CSS · React Router · Axios |
| Backend | Django 5.2 · Django REST Framework · SimpleJWT · Gunicorn |
| Base de datos | PostgreSQL 15 (una por microservicio) |
| Archivos | Amazon S3 (presigned URLs) |
| Gateway | Nginx (proxy inverso + SPA) |
| Infraestructura | Docker · Docker Compose · Amazon EC2 |

## Funcionalidades

- Registro e inicio de sesión con JWT
- Crear grupos y agregar miembros
- Crear canales dentro de grupos
- Chat grupal, por canal y privado (uno a uno)
- Archivos adjuntos con previsualización de imágenes

## Levantar en local

```bash
# 1. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 2. Levantar todo
docker compose up --build
```

Abrí `http://localhost` en el navegador.

## Despliegue en producción

Ver [`docs/DEPLOY_AWS.md`](docs/DEPLOY_AWS.md) para la guía completa de despliegue en AWS EC2 incluyendo HTTPS, backups y configuración de S3.
