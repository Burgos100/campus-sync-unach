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

## Despliegue en AWS EC2

Para desplegar este proyecto en la nube utilizando Amazon Web Services (EC2), sigue estos pasos:

1. Lanza una nueva instancia EC2 utilizando la AMI de **Ubuntu Server** (20.04, 22.04 o 24.04).
2. Asegúrate de configurar los **Grupos de Seguridad (Security Groups)** para abrir los siguientes puertos:
   - `22` (SSH)
   - `80` (HTTP - Frontend)
   - `3000` (Backend API)
3. En el paso de configuración avanzada de la instancia, pega el contenido del archivo `aws-ec2-userdata.sh` en la sección **"User data"** (asegúrate de cambiar la URL del repositorio y tu GEMINI_API_KEY en el script antes de pegarlo).
4. La instancia se iniciará, instalará Docker, clonará tu repositorio y levantará la plataforma automáticamente. En unos minutos podrás acceder a través de la **IP Pública** de tu instancia.

## Integración Continua (CI/CD)

El proyecto cuenta con GitHub Actions configurado en `.github/workflows/devops-pipeline.yml`. Al hacer push a `main`, se ejecutan las pruebas, instalación de dependencias y construcción de imágenes Docker.
