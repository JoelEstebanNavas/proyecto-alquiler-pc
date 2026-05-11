# Plan de Pruebas

## Objetivo
Comprobar el correcto funcionamiento del sistema en sus tres capas: frontend, backend y base de datos.

## Pruebas realizadas
1. Arranque correcto del backend en el puerto 8080.
2. Carga de componentes en la pantalla principal.
3. Login correcto con usuario administrador.
4. Login correcto con usuario estandar.
5. Alta de componentes con rol `ADMIN`.
6. Bloqueo de alta de componentes para usuarios sin rol de administrador.
7. Alquiler de componentes disponibles con rol `USER`.
8. Verificacion de la actualizacion del estado del componente a `Alquilado`.
9. Comprobacion de los datos en MySQL mediante phpMyAdmin.

## Resultado esperado
Todas las pruebas deben permitir comprobar que la aplicacion responde correctamente, que la informacion se guarda en base de datos y que existe una diferenciacion funcional entre administrador y usuario.

## Evidencias
Las capturas y resultados obtenidos se recogen en el documento `Evidencias.pdf`.
