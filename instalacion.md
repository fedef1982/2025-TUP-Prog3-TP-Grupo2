# Documento de Instalación - Aplicación Adoptar

## Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de Usuario](#configuración-de-usuario)
3. [Actualización del Sistema](#actualización-del-sistema)
4. [Instalación de PostgreSQL](#instalación-de-postgresql)
5. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
6. [Instalación de Node.js y npm](#instalación-de-nodejs-y-npm)
7. [Clonación del Repositorio](#clonación-del-repositorio)
8. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
9. [Instalación y Ejecución del Backend](#instalación-y-ejecución-del-backend)
10. [Instalación y Ejecución del Frontend](#instalación-y-ejecución-del-frontend)

## 1. Requisitos Previos
- Sistema operativo basado en Debian/Ubuntu
- Acceso a internet
- Permisos de administrador (sudo)

## 2. Configuración de Usuario
> **Nota:** Reemplaza `nombre_usuario` con el nombre de usuario deseado.

```bash
# Crear nuevo usuario
sudo adduser nombre_usuario

# Agregar usuario al grupo sudo
sudo adduser nombre_usuario sudo
```

> **Importante:** Después de crear el usuario, cierra sesión y vuelve a iniciar con el nuevo usuario.

## 3. Actualización del Sistema
```bash
# Actualizar lista de paquetes y el sistema
sudo apt update && sudo apt upgrade -y
```

## 4. Instalación de PostgreSQL

### 4.1 Instalación del Paquete
```bash
# Actualizar lista de paquetes
sudo apt update

# Instalar PostgreSQL y utilidades adicionales
sudo apt install postgresql postgresql-contrib -y
```

### 4.2 Verificar Instalación
```bash
# Verificar estado del servicio PostgreSQL
sudo systemctl status postgresql
```

> **Nota:** Si el servicio no está activo, ejecuta: `sudo systemctl start postgresql`

## 5. Configuración de la Base de Datos

### 5.1 Configuración Inicial de PostgreSQL
```bash
# Acceder a PostgreSQL como usuario postgres
sudo -u postgres psql
```

Dentro de la consola de PostgreSQL (`psql`), ejecuta los siguientes comandos:

```sql
-- Cambiar contraseña del usuario postgres
\password postgres
-- Ingresa: adoptar54321 (o la contraseña que prefieras)

-- Crear base de datos principal
CREATE DATABASE adoptar;

-- Crear usuario específico para la aplicación
CREATE USER adoptar WITH PASSWORD 'adoptar54321';

-- Otorgar privilegios al usuario
GRANT ALL PRIVILEGES ON DATABASE adoptar TO adoptar;

-- Salir de psql
\q
```

### 5.2 Configurar Acceso Remoto (Opcional)

> **Nota:** Estos pasos son necesarios si requieres conexión desde otras máquinas.

```bash
# Editar archivo de configuración principal
# Reemplaza <versión> con tu versión de PostgreSQL (ej: 14, 15, etc.)
sudo nano /etc/postgresql/16/main/postgresql.conf
```

Busca y modifica la línea:
```
# CONEXIÓN Y AUTENTICACIÓN
listen_addresses = '*'          # en lugar de 'localhost' o '127.0.0.1'
port = 5432                     # asegúrate que sea 5432
```

```bash
# Editar archivo de autenticación
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

Agrega al final del archivo:
```
# TIPO  DATABASE  USER  ADDRESS  METHOD
host    all       all   0.0.0.0/0   md5
host    all       all   ::/0        md5
```

```bash
# Reiniciar PostgreSQL para aplicar cambios
sudo systemctl restart postgresql
```

### 5.3 Ejecutar Script de Inicialización
```bash
# Conectar a la base de datos y ejecutar script
sudo -u postgres psql -d adoptar
```

Dentro de `psql`, copia y pega el siguiente script completo:

```sql
-- Script para crear las tablas y datos iniciales de la base de datos

-- Crear tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO roles (id, nombre)
VALUES 
    (1, 'Admin'),
    (2, 'Publicador');

-- Crear tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    contrasenia VARCHAR(100) NOT NULL,
    rol_id INTEGER NOT NULL,
    telefono VARCHAR(100),
    direccion VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
        CONSTRAINT fk_rol
          FOREIGN KEY(rol_id)
            REFERENCES roles(id)
);

-- Insertar único usuario con el rol ADMIN de la página
INSERT INTO usuarios (email, nombre, apellido, contrasenia, rol_id) 
VALUES 
    ('admin@adoptar.com', 'Admin', 'Administrador', '$2b$10$B1uGNFeQyFpv0yLhlmqPHed5j/3VWywHTFiCkaPWz9/cQuBA64w/e', 1);

-- Crear enums Mascotas
CREATE TYPE tamanio_num AS ENUM ('Chico', 'Mediano', 'Grande');
CREATE TYPE sexo_enum AS ENUM ('Macho', 'Hembra');

-- Crear tabla especies
CREATE TABLE IF NOT EXISTS especies (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50)
);

-- Insertar algunos datos de ejemplo en la tabla de especie
INSERT INTO especies (nombre)
VALUES 
    ('Perro'),
    ('Gato'),
    ('Pajaro'),
    ('Erizo'),
    ('Otro');

-- Crear tabla condiciones
CREATE TABLE IF NOT EXISTS condiciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion VARCHAR(255)
);

-- Insertar algunos datos de ejemplo en la tabla de condición
INSERT INTO condiciones (nombre, descripcion)
VALUES 
    ('Casa', 'El animal está temporalmente viviendo en el hogar de una persona que lo cuida hasta que encuentre su familia adoptiva definitiva'),
    ('Tránsito', 'El animal se encuentra en un lugar provisorio'),
    ('Refugio', 'El animal reside en una instalación dedicada al cuidado de animales sin hogar');

-- Crear tabla mascotas
CREATE TABLE IF NOT EXISTS mascotas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    raza VARCHAR(100),
    sexo sexo_enum,
    edad INTEGER,
    vacunado BOOLEAN,
    tamanio tamanio_num,
    fotos_url JSON NOT NULL,
    especie_id INTEGER,
    condicion_id INTEGER,
    usuario_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_especie
      FOREIGN KEY(especie_id)
        REFERENCES especies(id),
    CONSTRAINT fk_condicion
      FOREIGN KEY(condicion_id)
        REFERENCES condiciones(id),
    CONSTRAINT fk_usuario
      FOREIGN KEY(usuario_id)
        REFERENCES usuarios(id)
);

-- Crear enum de estado de Publicación
CREATE TYPE estado_publi_enum AS ENUM ('Abierta', 'Cerrada');

-- Crear tabla publicaciones
CREATE TABLE IF NOT EXISTS publicaciones (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    ubicacion VARCHAR(100) NOT NULL,
    contacto VARCHAR(100) NOT NULL,
    publicado TIMESTAMP,
    estado estado_publi_enum,
    mascota_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_mascota
      FOREIGN KEY(mascota_id)
        REFERENCES mascotas(id)
);

-- Crear enums visitas
CREATE TYPE estado_visita_enum AS ENUM ('Pendiente', 'Aprobado', 'Rechazado');
CREATE TYPE horario_enum AS ENUM ('Maniana', 'Tarde', 'Noche');

-- Crear tabla visitas
CREATE TABLE IF NOT EXISTS visitas (
    id SERIAL PRIMARY KEY,
    estado estado_visita_enum,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    disponibilidad_fecha DATE,
    disponibilidad_horario horario_enum,
    descripcion TEXT,
    tracking VARCHAR(100),
    publicacion_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_publicacion
      FOREIGN KEY(publicacion_id)
        REFERENCES publicaciones(id)
);

-- Crear tabla donaciones
CREATE TABLE IF NOT EXISTS donaciones (
    id SERIAL PRIMARY KEY,
    destinatario VARCHAR(100),
    cbu VARCHAR(100),
    cuit VARCHAR(100),
    entidad_financiera VARCHAR(100) NOT NULL,
    tipo_cuenta VARCHAR(100),
    alias VARCHAR(100) NOT NULL,
    link_pago VARCHAR(100),
    motivo_donacion VARCHAR(100),
    usuario_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_usuario
      FOREIGN KEY(usuario_id)
        REFERENCES usuarios(id)
);
```
Verificar y salir:
```sql
-- Verificar tablas creadas
\dt

-- Salir de psql
\q
```

## 6. Instalación de Node.js y npm

### 6.1 Instalar nvm (Node Version Manager)
```bash
# Descargar e instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Cargar nvm en la sesión actual
\. "$HOME/.nvm/nvm.sh"

# Agregar nvm al perfil del shell
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc

# Recargar el perfil
source ~/.bashrc
```

### 6.2 Instalar Node.js
```bash
# Instalar Node.js versión 22
nvm install 22

# Usar Node.js versión 22 por defecto
nvm use 22
nvm alias default 22
```

### 6.3 Verificar Instalación
```bash
# Verificar versión de Node.js
node -v  # Debería mostrar "v22.x.x"

# Verificar versión de npm
npm -v   # Debería mostrar "10.x.x"
```

## 7. Clonación del Repositorio
```bash
# Instalar git
sudo apt install git -y

# Clonar repositorio desde GitHub
git clone https://github.com/fedef1982/adoptar.git adoptar

# Navegar al directorio del proyecto
cd adoptar
```

## 8. Configuración de Variables de Entorno

### 8.1 Backend
```bash
# Crear archivo .env para el backend
nano backend/.env
```

Agrega el siguiente contenido:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=adoptar54321
DB_NAME=adoptar
JWT_SECRET=adoptar54321
JWT_EXPIRES_IN=1d
```

### 8.2 Frontend
```bash
# Crear archivo .env para el frontend
nano frontend/.env
```

Agrega el siguiente contenido:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
JWT_SECRET=adoptar54321
JWT_EXPIRES_IN=1d
JWT_ALGORITHM=HS256 

```

## 9. Instalación y Ejecución del Backend
```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias
npm install

# Corregir vulnerabilidades (si las hay)
npm audit fix

# Ejecutar en modo desarrollo
npm run start:dev
```

> **Nota:** El backend debería ejecutarse en `http://localhost:3001`. Mantén esta terminal abierta.

## 10. Instalación y Ejecución del Frontend

```bash
# En una nueva terminal, navegar al directorio 
# frontend del proyecto
cd frontend

# Instalar pnpm globalmente
npm install -g pnpm

# Instalar dependencias con pnpm
pnpm install
```

**Opcional**
Modificar para acceder desde la red:

```bash
# Opcional Editar archivo para habilitar para el frontend
nano next.config.ts
```

- Agrega el siguiente contenido:
```
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... otras configuraciones
  
  // Agregar esto:
  allowedDevOrigins: ['*', 'localhost', '127.0.0.1']
}

# Ejecutar en modo desarrollo
pnpm run dev
```

> **Nota:** El frontend debería ejecutarse en `http://localhost:3000`.

## Verificación Final

1. **Backend**: Abre `http://localhost:3001` en tu navegador o usa:
   ```bash
   curl http://localhost:3001
   ```

2. **Frontend**: Abre `http://localhost:3000` en tu navegador.

3. **Base de datos**: Verifica conexión:
   ```bash
   sudo -u postgres psql -d adoptar -c "SELECT COUNT(*) FROM usuarios;"
   ```

## Credenciales de Acceso

- **URL de la aplicación**: `http://localhost:3000`
- **Usuario administrador**: `admin@adoptar.com`
- **Contraseña**: `adoptar123`

## Solución de Problemas Comunes

### PostgreSQL no inicia
```bash
# Verificar logs
sudo journalctl -u postgresql

# Reiniciar servicio
sudo systemctl restart postgresql
```

### Problemas con puertos ocupados
```bash
# Verificar puertos en uso
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :3001
```

### Errores de dependencias
```bash
# En el directorio del backend/frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Soporte
Para problemas adicionales, revisa los logs de cada servicio o consulta la documentación del proyecto.
