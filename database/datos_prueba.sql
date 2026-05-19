USE alquiler_pc;

INSERT INTO componentes (nombre, tipo, estado) VALUES
('PC Gaming ASUS', 'Ordenador', 'Disponible'),
('Monitor LG 24', 'Monitor', 'Disponible'),
('Teclado Logitech', 'Periferico', 'Alquilado'),
('Kingston Fury 8GB DDR4', 'Memoria RAM', 'Disponible'),
('Corsair Vengeance 16GB DDR4', 'Memoria RAM', 'Disponible'),
('Samsung 970 EVO 1TB', 'SSD', 'Disponible'),
('Crucial BX500 500GB', 'SSD', 'Alquilado'),
('Seagate Barracuda 2TB', 'HDD', 'Disponible'),
('Western Digital Blue 1TB', 'HDD', 'Disponible'),
('NVIDIA RTX 4060', 'Grafica', 'Disponible'),
('AMD Radeon RX 7600', 'Grafica', 'Alquilado'),
('Intel Core i5 12400F', 'Procesador', 'Disponible'),
('AMD Ryzen 7 5800X', 'Procesador', 'Disponible'),
('ASUS Prime B550M-A', 'Placa base', 'Disponible'),
('MSI B760 Gaming Plus', 'Placa base', 'Disponible'),
('Cooler Master Hyper 212', 'Refrigeracion', 'Disponible'),
('Corsair H100 RGB', 'Refrigeracion', 'Alquilado'),
('NZXT H5 Flow', 'Caja', 'Disponible'),
('Nfortec Draco V2', 'Caja', 'Disponible'),
('Fuente Corsair RM750', 'Fuente de alimentacion', 'Disponible'),
('Monitor Samsung Odyssey G5', 'Monitor', 'Disponible'),
('Raton Logitech G203', 'Periferico', 'Disponible'),
('Teclado Redragon Kumara', 'Periferico', 'Disponible');

INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Admin Principal', 'admin@alquilerpc.com', 'admin123', 'ADMIN'),
('Usuario Prueba', 'usuario@alquilerpc.com', 'user123', 'USER');

INSERT INTO alquileres (fecha_inicio, fecha_fin, estado, metodo_pago, usuario_id, componente_id) VALUES
('2026-04-25', '2026-05-02', 'Activo', 'Tarjeta', 2, 3),
('2026-04-10', '2026-04-17', 'Finalizado', 'Bizum', 1, 2);
