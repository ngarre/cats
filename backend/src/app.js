//Cargar librerías
const express = require('express'); //Framework web para Node.js que te permite crear servidores de manera rápida
const cors = require('cors'); //Controla políticas de acceso de tu servidor, en este caso Express
const knex = require('knex'); //Librería de JavaScript para Node.js que sirve como un constructor de consultas SQL

//Lanzar las aplicaciones de las liberías
const app = express();
app.use(cors());
app.use(express.json());

//Lanzar BBDD (DB Browser for SQLite)
const db = knex({
    client: 'sqlite3',
    connection: {
        filename: 'cats.db'
    },
    useNullAsDefault: true //Devuelve valor nulo para aquello que no tenga datos
});