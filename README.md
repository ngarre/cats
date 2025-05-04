# cats
                Arquitectura en 3 capas: BBDD, Backend (API) + Frontend

Este es un proyecto para gestinoar una base de datos de gatos y sus dueños.

Se compone de un frontend que se comunica con una API que gestiona la BBDD permitiendo realizar las operaciones CRUD sobre los diferentes elementos de la BBDD.

                                 BBDD --> API REST --> FRONTEND

## Tecnologías
Base de Datos: MariaDB (MySQL)

API Backend: Node + Express + express-validator (para validar las entradas a la BBDD).  Backend organizado en capa Services, Controller y Routes.

Frontend: Framework de estilos Boostrap

## Lanzar proyecto
El frontend y el backend se van a ejecutar de manera separada e independiente

> Si es la primera vez que lanzas el proyecto ejecuta en la carpeta `backend` y en la carpeta `frontend`: `npm install`

### Lanzar la API 
Ejecuta dentro del `backend`: `npm start` --> Esto corre el proyecto en modo producción, es decir con BBDD local 

### Lanzar el frontend 
Ejecuta dentro del `frontend`: `npm start`

## Tests
### Tests Unitarios
Ejecuta dentro del `backend`: `npm run test-unit`

### Tests Integración
Funcionan con base de datos de prueba en contenedor.  Sitúate en carpeta `db` y ejecuta `docker compose up`.

Después situate en `backend` y ejecuta: `npm run test-int`

## Automatización mediante archivo Makefile
Puedes automatizar lo anterior por medio de comandos make:

1. Correr tests unitarios: `make unit`
2. Levantar contenedor BBDD pruebas y correr tests integración: `make integration`
3. Correr tests unitarios, levantar contenedor BBDD pruebas, correr tests integración y destruir entorno pruebas: `make test`

## Contenerizar todo el proyecto (Docker compose)
En raíz: `docker compose up`

## GitHub Actions
Mediante archivo `.github/workflows/integration-test.yaml`.  Permite correr workflow de forma manual en GitHub.

Este workflow: construye BBDD pruebas, corre tests de integración, levanta docker del backend y del frontend.  

Finalmente lanza análisis de SonarQube, utilizando SonarCloud.


[Documentación](https://github.com/ngarre/cats/wiki)