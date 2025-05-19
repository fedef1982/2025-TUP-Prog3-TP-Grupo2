-- Crear enum de roles
CREATE TYPE rol_enum AS ENUM ('Admin', 'Publicador');

-- Crear tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    contrasenia VARCHAR(100) NOT NULL,
    rol rol_enum,
    telefono VARCHAR(100),
    direccion VARCHAR(100),
    create_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Insertar algunos datos de ejemplo en la tabla de categorias
INSERT INTO usuarios (email, nombre, apellido, contrasenia, rol, telefono, direccion)
VALUES 
    ('paolarladera@gmail.com', 'paola', 'rodriguez', 'paola', 'Publicador', '123456789', 'Calle falsa');

-- Crear enum de estado
CREATE TYPE estado_publi_enum AS ENUM ('Abierta', 'Cerrada');

-- Crear tabla publicaciones
CREATE TABLE IF NOT EXISTS publicaciones (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(100) NOT NULL,
    contacto VARCHAR(100) NOT NULL,
    fotos_url JSON NOT NULL,
    publicado TIMESTAMP,
    estado estado_enum,
    usuario_id INTEGER,
    mascota_id INTEGER,
    create_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_usuario
      FOREIGN KEY(usuario_id)
        REFERENCES usuarios(id),
    CONSTRAINT fk_mascota
      FOREIGN KEY(mascota_id)
        REFERENCES mascotas(id)
);

-- Crear enums
CREATE TYPE especie_num AS ENUM ('Perro', 'Gato', 'Pajaro');
CREATE TYPE tamanio_num AS ENUM ('Chico', 'Mediano', 'Grande');
CREATE TYPE condicion_num AS ENUM ('Casa', 'Transito', 'Refugio');

-- Crear tabla mascotas
CREATE TABLE IF NOT EXISTS mascotas (
    id SERIAL PRIMARY KEY,
    especie especie_num,
    raza VARCHAR NOT NULL,
    edad INTEGER,
    tamanio tamanio_num,
    condicion condicion_num,
    create_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Crear enums
CREATE TYPE estado_visita_enum AS ENUM ('Pendiente', 'Aprobado', 'Rechazado');
CREATE TYPE horario_enum AS ENUM ('Maniana', 'Tarde', 'Noche');

-- Crear tabla visitas
CREATE TABLE IF NOT EXISTS visitas (
    id SERIAL PRIMARY KEY,
    estado estado_visita_enum,
    nombre VARCHAR,
    apellido VARCHAR,
    telefono VARCHAR,
    email VARCHAR,
    disponibilidad_fecha DATE,
    disponibilidad_horario horario_enum,
    descripcion TEXT,
    publicacion_id INTEGER,
    create_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
    CONSTRAINT fk_publicacion
      FOREIGN KEY(publicacion_id)
        REFERENCES publicaciones(id)
);

-- Insertar algunos datos de ejemplo en la tabla de categorias
INSERT INTO usuarios (nombre, descripcion)
VALUES 
    ('limpieza', 'Productos de limpieza'),
    ('alimento', 'Productos comestibles');

-- Insertar algunos datos de ejemplo en la tabla de productos
INSERT INTO productos (nombre, cantidad, categoria_id, fecha_compra, fecha_vencimiento)
VALUES 
    ('lavandina', 5, 3, '2025-01-30', '2025-04-30'),
    ('leche', 2, 4, '2025-02-30', '2025-03-10'),
    ('harina', 10, 4, '2025-05-08', '2026-01-30'),
    ('jabon', 20, 3, '2025-01-30', '2028-01-30');

