# Proyecto Alquiler PC

Aplicacion basica para la gestion de componentes, usuarios y alquileres con frontend web y backend Spring Boot.

## Tecnologias
- HTML
- CSS
- JavaScript
- Java 17
- Spring Boot
- Spring Data JPA
- MySQL

## Estructura
```text
proyecto-alquiler-pc/
|- frontend/
|- backend/backend-alquiler/
|- database/
|- uml/
|- MemoriaFInal.md
|- PRUEBAS.md
|- Evidencias.pdf
```

## Requisitos
- Java 17
- MySQL
- Maven o Maven Wrapper funcional

## Base de datos
1. Crear o abrir una conexion MySQL.
2. Ejecutar `database/schema.sql`.
3. Ejecutar `database/datos_prueba.sql`.

## Configuracion backend
Revisar el archivo:

`backend/backend-alquiler/src/main/resources/application.properties`

Configuracion actual:
- Base de datos: `alquiler_pc`
- Usuario: `root`
- Password: ninguna

## Ejecucion
1. Arrancar MySQL.
2. Iniciar el backend desde el IDE o con Maven.
3. Abrir `frontend/login.html` o `frontend/index.html`.

## Endpoints principales
- `GET /api/componentes`
- `POST /api/componentes`
- `GET /api/alquileres`
- `POST /api/alquileres`
- `GET /api/auth/usuarios`
- `POST /api/auth/register`
- `POST /api/auth/login`

## Usuarios de prueba
- `admin@alquilerpc.com` / `admin123`
- `usuario@alquilerpc.com` / `user123`
