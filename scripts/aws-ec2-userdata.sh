#!/bin/bash
# =========================================================================
# Script de User Data para AWS EC2 - CampusSync
# =========================================================================

# 1. Crear Memoria Virtual (SWAP) -> ¡ESTO EVITA QUE EL T2.MICRO COLAPSE!
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# 2. Instalar herramientas básicas y Docker
apt-get update -y
apt-get install git curl unzip docker.io -y
systemctl start docker
systemctl enable docker
usermod -aG docker ubuntu

# 3. Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 4. Clonar el repositorio (Apuntando a la rama master donde subimos todo lo nuevo)
cd /home/ubuntu
git clone -b master https://github.com/Burgos100/campus-sync-unach.git campus-sync
cd campus-sync

# 5. Configurar Variables de Entorno de forma segura (.env)
cat <<EOT >> .env
DB_ROOT_PASSWORD=CampusSeguro_2026!
DB_NAME=campussync
DB_USER=admin
DB_PASSWORD=admin_password_seguro
PORT=3000
GEMINI_API_KEY=REEMPLAZA_ESTO_POR_TU_API_KEY_REAL
EOT

chown -R ubuntu:ubuntu /home/ubuntu/campus-sync

# 6. Desplegar la aplicación con Docker Compose
su - ubuntu -c "cd /home/ubuntu/campus-sync && docker-compose up -d --build"
