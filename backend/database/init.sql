-- Script para crear las tablas y datos iniciales de la base de datos

--crear tabla de roles
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

-- Insertar algunos datos de ejemplo en la tabla de usuarios
INSERT INTO usuarios (email, nombre, apellido, contrasenia, rol_id, telefono, direccion)
VALUES 
    ('paolarladera@gmail.com', 'paola', 'rodriguez', 'paola', 2, '123456789', 'Calle falsa');

-- Insertar unico usuario con el rol ADMIN de la pagina
INSERT INTO usuarios (email, nombre, apellido, contrasenia, rol_id) 
VALUES 
    ('admin@adoptar.com', 'Admin', 'Administrador', 'adoptar123', 1);

-- Crear enums Mascotas
CREATE TYPE tamanio_num AS ENUM ('Chico', 'Mediano', 'Grande');

CREATE TYPE sexo_enum AS ENUM ('Macho', 'Hembra');

-- Creo tabla especies
CREATE TABLE IF NOT EXISTS especies (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR 
);

-- Insertar algunos datos de ejemplo en la tabla de especie
INSERT INTO especies (nombre)
VALUES 
    ('Perro'),
    ('Gato'),
    ('Pajaro');

-- Creo tabla condiciones
CREATE TABLE IF NOT EXISTS condiciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR,
    descripcion VARCHAR
);

-- Insertar algunos datos de ejemplo en la tabla de condicion
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

-- Insertar algunos datos de ejemplos en la tabla de mascotas
INSERT INTO mascotas (nombre, raza, sexo, edad, vacunado, tamanio, fotos_url, especie_id, condicion_id, usuario_id)
VALUES (
  'Rocky', 'Labrador', 'Macho', 1, true, 'Mediano', '["https://ejemplo.com/foto1.jpg", "https://ejemplo.com/foto2.jpg"]', 1, 1, 1);

-- Crear enum de estado de Publicacion
CREATE TYPE estado_publi_enum AS ENUM ('Abierto', 'Cerrado');

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

-- Insertar algunos datos de ejemplo en la tabla de Publicaciones

INSERT INTO publicaciones (titulo, descripcion, ubicacion, contacto, estado, mascota_id)
VALUES 
    ('Perro 1', 'Perro lindo', 'Zona norte', '11-1234-5678', 'Cerrado', '1');

/*   ('Gato 1', 'Gato bueno', 'Zona sur', 'email@nombre.com', 'Abierto', '2'),
    ('Perro 2', 'Perro bueno', 'Zona este', '11-5678-1234', 'Abierto', '3'),
    ('Gato 2', 'Gato lindo', 'Zona oeste', 'nombre@email.com', 'Cerrado', '4');

Necesitamos primero crear las mascotas de ejemplo para vincularla con mascota_id
*/
-- Crear enums visitas
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_publicacion
      FOREIGN KEY(publicacion_id)
        REFERENCES publicaciones(id)
);

INSERT INTO visitas(estado,nombre,apellido,telefono,email,disponibilidad_fecha,disponibilidad_horario,descripcion,publicacion_id)
VALUES ('Pendiente','Adriel','Reina','11-2233-4455','elPublicador@gmail.com','2025-06-01','Tarde','la descripcion',1)

