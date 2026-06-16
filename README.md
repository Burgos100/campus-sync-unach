# CampusSync UnACh - DevOps Platform

Plataforma Cloud para Gestión de Actividades Universitarias orientada a estudiantes.

## Stack Tecnológico
- **Frontend:** Angular, Nginx (Docker)
- **Backend:** Node.js, Express, Jest, PM2
- **Base de Datos:** MySQL 8
- **DevOps:** Docker, Docker Compose, GitHub Actions

## Ejecución Local

1. Clonar el repositorio.
2. Copiar `.env.example` a `.env` y configurar las variables.
3. Ejecutar `docker-compose up -d --build`.
4. El frontend estará disponible en `http://localhost:80` y el backend en `http://localhost:3000`.

## Integración Continua (CI/CD)

El proyecto cuenta con GitHub Actions configurado en `.github/workflows/devops-pipeline.yml`. Al hacer push a `main`, se ejecutan las pruebas, instalación de dependencias y construcción de imágenes Docker.
