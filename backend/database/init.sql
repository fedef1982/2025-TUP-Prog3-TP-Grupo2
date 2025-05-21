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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Insertar algunos datos de ejemplo en la tabla de usuarios
INSERT INTO usuarios (email, nombre, apellido, contrasenia, rol, telefono, direccion)
VALUES 
    ('paolarladera@gmail.com', 'paola', 'rodriguez', 'paola', 'Publicador', '123456789', 'Calle falsa');

-- Crear enums Mascotas
CREATE TYPE tamanio_num AS ENUM ('Chico', 'Mediano', 'Grande');

-- Creo tabla especies
CREATE TABLE IF NOT EXISTS especies (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR 
)

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
)

-- Insertar algunos datos de ejemplo en la tabla de condicion
INSERT INTO condiciones (nombre, descripcion)
VALUES 
    ('Casa', 'Se encuentra en casa de acompañante humano'),
    ('Transito', 'Se encuentra en lugar transitorio'),
    ('Refugio', 'Se encuentra en refugio');

-- Crear tabla mascotas
CREATE TABLE IF NOT EXISTS mascotas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    raza VARCHAR(100) NOT NULL,
    edad INTEGER,
    vacunado BOOLEAN,
    tamanio tamanio_num,
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
        REFERENCES usuarios(id),
);

-- Crear enum de estado de Publicacion
CREATE TYPE estado_publi_enum AS ENUM ('Abierta', 'Cerrada');

-- Crear tabla publicaciones
CREATE TABLE IF NOT EXISTS publicaciones (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    ubicacion VARCHAR(100) NOT NULL,
    contacto VARCHAR(100) NOT NULL,
    fotos_url JSON NOT NULL,
    publicado TIMESTAMP,
    estado estado_enum,
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
    deleted_at TIMESTAMP WITH TIME ZONE
    CONSTRAINT fk_publicacion
      FOREIGN KEY(publicacion_id)
        REFERENCES publicaciones(id)
);


