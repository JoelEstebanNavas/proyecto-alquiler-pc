USE alquiler_pc;

INSERT INTO componentes (nombre, tipo, estado) VALUES
('PC Gaming ASUS', 'Ordenador', 'Disponible'),
('Monitor LG 24', 'Monitor', 'Disponible'),
('Teclado Logitech', 'Periferico', 'Alquilado');

INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Admin Principal', 'admin@alquilerpc.com', 'admin123', 'ADMIN'),
('Usuario Prueba', 'usuario@alquilerpc.com', 'user123', 'USER');

INSERT INTO alquileres (fecha_inicio, fecha_fin, estado, usuario_id, componente_id) VALUES
('2026-04-25', '2026-05-02', 'Activo', 2, 3),
('2026-04-10', '2026-04-17', 'Finalizado', 1, 2);
