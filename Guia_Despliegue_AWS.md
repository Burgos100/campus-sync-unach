# Guía Definitiva de Despliegue en AWS EC2 (CampusSync)

Esta guía contiene los pasos exactos y a prueba de fallos para levantar tu proyecto en la nube durante el día de la presentación.

## PASO 1: Lanzar la Instancia
1. Entra a tu consola de **AWS** y ve al servicio **EC2**.
2. Haz clic en el botón naranja **"Lanzar instancia"**.
3. **Nombre:** Ponle `CampusSync-Produccion` (o el que prefieras).
4. **Sistema Operativo (AMI):** Selecciona **Ubuntu** (asegúrate de que diga Ubuntu Server 22.04 o 24.04 LTS y tenga la etiqueta *Apto para la capa gratuita*).
5. **Tipo de instancia:** `t2.micro`.
6. **Par de claves:** Selecciona tu llave `.pem` existente o crea una nueva.

## PASO 2: Configurar la Red (Firewall / Security Group)
Asegúrate de marcar estas casillas en "Configuraciones de red":
- [x] Permitir tráfico SSH
- [x] Permitir tráfico HTTP desde Internet (Puerto 80)

Luego, haz clic en **"Editar"** en esa misma sección, dale a "Agregar regla de grupo de seguridad" y añade:
- **Tipo:** TCP personalizado (Custom TCP)
- **Rango de puertos:** `3000`
- **Origen:** Anywhere-IPv4 (`0.0.0.0/0`)

## PASO 3: Aumentar el Disco Duro (CRÍTICO)
Para evitar el error `no space left on device` al compilar Angular:
1. Baja hasta la sección **Configurar almacenamiento** (Configure storage).
2. Cambia el valor que dice `8 GiB` por **`20`** (sigue siendo gratis bajo la capa gratuita de AWS).

## PASO 4: El Script Mágico (User Data)
1. Despliega la última sección llamada **Detalles Avanzados** (Advanced Details).
2. Baja hasta el final al cuadro de texto gigante **Datos de usuario** (User Data).
3. **Copia y pega EXACTAMENTE este script** (Solo recuerda cambiar donde dice `TU_CLAVE_GEMINI_AQUI` por tu llave real antes de lanzar):

```bash
#!/bin/bash
# =========================================================================
# Script de Despliegue Automático - CampusSync
# =========================================================================

# 1. Crear Memoria Virtual (SWAP) -> Evita que Angular colapse por falta de RAM
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# 2. Instalar herramientas y Docker
apt-get update -y
apt-get install git curl unzip docker.io -y
systemctl start docker
systemctl enable docker
usermod -aG docker ubuntu

# 3. Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 4. Clonar el repositorio
cd /home/ubuntu
git clone -b master https://github.com/Burgos100/campus-sync-unach.git campus-sync
cd campus-sync

# 5. Configurar Variables de Entorno (.env)
cat <<EOT >> .env
DB_ROOT_PASSWORD=CampusSeguro_2026!
DB_NAME=campussync
DB_USER=admin
DB_PASSWORD=admin_password_seguro
PORT=3000
GEMINI_API_KEY=TU_CLAVE_GEMINI_AQUI
EOT

chown -R ubuntu:ubuntu /home/ubuntu/campus-sync

# 6. Desplegar
su - ubuntu -c "cd /home/ubuntu/campus-sync && docker-compose up -d --build"
```

## PASO 5: Lanzar y Esperar
1. Haz clic en **Lanzar Instancia**.
2. Copia la Dirección IPv4 Pública que te dará AWS.
3. **Espera exactamente 5 minutos** (Docker necesita tiempo para descargar Ubuntu, Node, MySQL, y compilar Angular desde cero).
4. Abre una ventana de **Incógnito** en tu navegador y escribe `http://TU_IP_PUBLICA`. (OJO: Asegúrate de que empiece por `http://` y no `https://`).

¡Y listo! La aplicación estará viva y conectada.
