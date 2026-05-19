CREATE DATABASE IF NOT EXISTS alquiler_pc;
USE alquiler_pc;

CREATE TABLE IF NOT EXISTS componentes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL,
    rol VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS alquileres (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(50) NOT NULL,
    metodo_pago VARCHAR(100) NOT NULL,
    usuario_id BIGINT NOT NULL,
    componente_id BIGINT NOT NULL,
    CONSTRAINT fk_alquiler_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_alquiler_componente FOREIGN KEY (componente_id) REFERENCES componentes(id)
);
