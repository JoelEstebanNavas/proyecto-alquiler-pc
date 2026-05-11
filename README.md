# Proyecto Alquiler PC

Aplicacion web sencilla para la gestion de componentes, usuarios y alquileres, desarrollada con frontend en HTML, CSS y JavaScript, backend en Spring Boot y base de datos MySQL.

## Estructura del proyecto
```text
proyecto-alquiler-pc/
|- frontend/
|  |- index.html
|  |- login.html
|  |- app.js
|  |- Css.css
|- backend/backend-alquiler/
|- database/
|- uml/
|- Guia.md
|- MemoriaFInal.md
|- Evidencias.pdf
```

## Requisitos
- Java 17 o superior
- MySQL
- Un IDE compatible con Maven

## Pasos de instalacion
1. Crear la base de datos ejecutando `database/schema.sql`.
2. Cargar los datos de prueba con `database/datos_prueba.sql`.
3. Revisar el archivo `backend/backend-alquiler/src/main/resources/application.properties`.
4. Iniciar `BackendAlquilerApplication` desde el IDE.
5. Abrir `frontend/login.html`.

## Usuarios de prueba
- `admin@alquilerpc.com` / `admin123`
- `usuario@alquilerpc.com` / `user123`

## Funcionalidades principales
- Login de usuarios
- Visualizacion del catalogo de componentes
- Alta de componentes por parte del administrador
- Alquiler de componentes disponibles por parte del usuario

## Documentacion incluida
- `MemoriaFInal.md`
- `Evidencias.pdf`
- `PRUEBAS.md`
- `uml/diagrama-clases.puml`
