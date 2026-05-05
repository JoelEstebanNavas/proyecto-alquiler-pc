# Memoria Segunda Entrega

## 1. Introduccion
Esta segunda entrega corresponde a la fase de desarrollo e implementacion del proyecto `Alquiler PC`. El objetivo del sistema es permitir la gestion de componentes informaticos, usuarios y alquileres mediante una aplicacion distribuida en capas.

El proyecto se ha desarrollado con una arquitectura cliente-servidor sencilla, empleando tecnologias web en el frontend, Spring Boot en el backend y MySQL como sistema de persistencia.

## 2. Diseno definitivo del sistema
El sistema se ha planteado para cubrir la gestion de recursos de hardware dentro de un entorno de alquiler. La solucion queda estructurada en tres bloques principales:

- Interfaz de usuario para operaciones basicas.
- Backend REST para el procesamiento de peticiones.
- Base de datos relacional para el almacenamiento de la informacion.

En la version actual se encuentran implementadas las operaciones basicas sobre componentes y se ha dejado preparada la base de usuarios y alquileres para continuar su ampliacion.

## 3. Arquitectura software final
La arquitectura utilizada sigue el modelo cliente-servidor con separacion por capas:

- Capa de presentacion:
  Archivos HTML, CSS y JavaScript situados en la carpeta `frontend/`.

- Capa de logica de negocio:
  Aplicacion Java con Spring Boot situada en `backend/backend-alquiler/`.

- Capa de acceso a datos:
  Repositorios JPA conectados a una base de datos MySQL.

### Flujo de funcionamiento
1. El usuario accede a la interfaz web.
2. El frontend lanza peticiones HTTP al backend.
3. El backend procesa la peticion mediante controladores y repositorios.
4. Los datos se guardan o consultan en MySQL.
5. La respuesta se devuelve al frontend en formato JSON.

## 4. Modelo de datos definitivo
El modelo de datos se compone de tres entidades principales:

### 4.1 Componente
Representa un recurso disponible para alquiler.

Campos:
- `id`
- `nombre`
- `tipo`
- `estado`

### 4.2 Usuario
Representa a la persona que utiliza el sistema.

Campos:
- `id`
- `nombre`
- `email`
- `password`
- `rol`

### 4.3 Alquiler
Representa la relacion entre un usuario y un componente durante un periodo concreto.

Campos:
- `id`
- `fechaInicio`
- `fechaFin`
- `estado`
- `usuario`
- `componente`

### 4.4 Relaciones
- Un usuario puede tener varios alquileres.
- Un componente puede estar asociado a varios alquileres a lo largo del tiempo.
- Cada alquiler pertenece a un unico usuario y a un unico componente.

## 5. Diagramas UML actualizados
Se ha incluido un diagrama de clases editable en:

![Imagen del UML](UML.png)

- `uml/diagrama-clases.puml`

Este diagrama representa las entidades principales del sistema y sus relaciones. Puede exportarse a imagen para incorporarlo como evidencia visual en la entrega final.

## 6. Implementacion

### 6.1 Estructura del proyecto
La estructura general del proyecto es la siguiente:

```text
proyecto-alquiler-pc/
|- frontend/
|  |- index.html
|  |- login.html
|  |- app.js
|  |- styles.css
|- backend/
|  |- backend-alquiler/
|     |- src/main/java/com/proyecto/backend/
|     |- src/main/resources/
|     |- src/test/java/com/proyecto/backend/
|- database/
|  |- schema.sql
|  |- datos_prueba.sql
|- uml/
|  |- diagrama-clases.puml
|- README.md
|- PRUEBAS.md
|- ENTREGA_2.md
```

### 6.2 Desarrollo de las funcionalidades principales
Las funcionalidades implementadas actualmente son:

- Alta de componentes mediante formulario web.
- Consulta de componentes desde el frontend.
- Registro basico de usuarios.
- Login basico de usuarios.
- Alta y consulta de alquileres mediante endpoints REST.

### 6.3 Integracion entre capas
La integracion entre capas se realiza de la siguiente forma:

- El frontend consume endpoints REST del backend.
- Los controladores reciben y responden peticiones HTTP.
- Los repositorios gestionan el acceso a la base de datos.
- Las entidades JPA representan las tablas del modelo relacional.

### 6.4 Gestion de usuarios y control de acceso
Se ha implementado una base funcional para usuarios:

- Registro de usuario mediante endpoint `POST /api/auth/register`
- Login mediante endpoint `POST /api/auth/login`
- Listado de usuarios mediante endpoint `GET /api/auth/usuarios`

El control de acceso es basico y no incluye seguridad avanzada, cifrado de contrasenas ni sesiones protegidas. Esta parte queda como posible mejora futura.

## 7. Base de datos

### 7.1 Relaciones y restricciones
Se han definido restricciones basicas para mantener la coherencia de los datos:

- `nombre`, `tipo` y `estado` obligatorios en `Componente`
- `nombre`, `email`, `password` y `rol` obligatorios en `Usuario`
- `email` unico en `Usuario`
- `fecha_inicio`, `fecha_fin` y `estado` obligatorios en `Alquiler`
- Claves foraneas desde `Alquiler` hacia `Usuario` y `Componente`

### 7.2 Scripts incluidos
El proyecto incluye los siguientes scripts:

- `database/schema.sql`
- `database/datos_prueba.sql`

### 7.3 Datos de prueba
Los datos de prueba permiten validar:

- Componentes disponibles y alquilados
- Usuarios con distintos roles
- Alquileres activos y finalizados

## 8. Pruebas

### 8.1 Plan de pruebas
El plan de pruebas se ha recogido en el archivo:

- `PRUEBAS.md`

Incluye pruebas manuales de:
- Carga de componentes
- Alta de componente
- Validacion de formulario
- Login correcto
- Login incorrecto
- Verificacion de datos en MySQL

### 8.2 Evidencias
Para completar la entrega deben adjuntarse evidencias como:

- Capturas del frontend funcionando
- Captura del login
- Captura de la base de datos con datos insertados
- Respuestas de endpoints probados

### 8.3 Incidencias detectadas y soluciones aplicadas
Durante el desarrollo se detectaron las siguientes incidencias:

- Problemas de codificacion de caracteres en el frontend
- Clases de usuarios y alquileres vacias en una fase inicial
- Ausencia de scripts SQL y de documentacion tecnica propia

Soluciones aplicadas:

- Normalizacion de textos para evitar caracteres conflictivos
- Implementacion basica de entidades, repositorios y controladores
- Creacion de scripts de esquema y datos de prueba
- Incorporacion de documentacion de proyecto, pruebas y UML

## 9. Despliegue

### 9.1 Requisitos del entorno
- Java 17
- MySQL
- IDE compatible con Maven o Maven instalado
- Navegador web

### 9.2 Instrucciones de instalacion y ejecucion
1. Crear la base de datos ejecutando `database/schema.sql`.
2. Cargar datos iniciales con `database/datos_prueba.sql`.
3. Revisar la configuracion del archivo `application.properties`.
4. Iniciar el backend desde el IDE o con Maven.
5. Abrir `frontend/login.html` o `frontend/index.html`.

### 9.3 Configuracion necesaria
Archivo principal de configuracion:

- `backend/backend-alquiler/src/main/resources/application.properties`

Configuracion actual:
- URL: `jdbc:mysql://localhost:3306/alquiler_pc`
- Usuario: `root`
- Password: ninguna
- `spring.jpa.hibernate.ddl-auto=update`

## 10. Estado actual y mejoras futuras
El proyecto dispone ya de una base funcional suficiente para demostrar la integracion entre presentacion, logica de negocio y acceso a datos. La parte de componentes esta operativa y las entidades de usuarios y alquileres han quedado preparadas con una implementacion inicial.

Como mejoras futuras se plantean:

- Seguridad con Spring Security
- Cifrado de contrasenas
- Validaciones mas completas
- Mejoras visuales del frontend
- Mas pruebas automaticas y cobertura real
