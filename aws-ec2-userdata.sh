#!/bin/bash
# =========================================================================
# Script de User Data para AWS EC2 (Basado en Ubuntu 20.04 / 22.04 / 24.04)
# =========================================================================

# 1. Actualizar el sistema
apt-get update -y
apt-get upgrade -y

# 2. Instalar herramientas básicas y Docker
apt-get install git curl unzip -y
apt-get install docker.io -y

# Habilitar y arrancar Docker
systemctl start docker
systemctl enable docker
usermod -aG docker ubuntu

# 3. Instalar Docker Compose (última versión)
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 4. Clonar el repositorio
# ¡IMPORTANTE! Reemplaza la URL de abajo con la de tu repositorio de GitHub.
# Si tu repositorio es privado, usa un token de acceso personal (PAT):
# git clone https://<TU_TOKEN>@github.com/tu-usuario/tu-repo.git campus-sync

cd /home/ubuntu
git clone https://github.com/Burgos100/campus-sync-unach.git campus-sync
cd campus-sync

# 5. Configurar Variables de Entorno de forma segura (.env)
cat <<EOT >> .env
DB_ROOT_PASSWORD=root_password_seguro
DB_NAME=campussync
DB_USER=admin
DB_PASSWORD=admin_password_seguro
PORT=3000
GEMINI_API_KEY=AQ.Ab8RN6LOU31Cem5WYvEpw46eOB0IbbyWn1u8rWfoNwcsnNqnaQ
EOT

# Ajustar permisos para el usuario ubuntu
chown -R ubuntu:ubuntu /home/ubuntu/campus-sync

# 6. Desplegar la aplicación con Docker Compose
# Ejecutamos como el usuario ubuntu para no usar root directamente en compose si no es necesario
su - ubuntu -c "cd /home/ubuntu/campus-sync && docker-compose up -d --build"
