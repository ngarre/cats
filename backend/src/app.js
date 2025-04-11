//Cargar librerías
const express = require('express'); //Framework web para Node.js que te permite crear servidores de manera rápida
const cors = require('cors'); //Controla políticas de acceso de tu servidor, en este caso Express
const knex = require('knex'); //Librería de JavaScript para Node.js que sirve como un constructor de consultas SQL
const { config } = require('./config/configuration');


const gatoRoutes = require('./routes/gatoROutes');
const propietarioRoutes = require('./routes/propietarioRoutes');

const app = express();
app.use(cors());
app.use(express.json());

//Lanzar BBDD (DB Browser for SQLite)
const db = knex({
    client: config.db.client,
    connection: {
        host: config.db.connection.host,
        port: config.db.connection.port,
        user: config.db.connection.user,
        password: config.db.connection.password,
        database: config.db.connection.database
    },
    useNullAsDefault: true //Devuelve valor nulo para aquello que no tenga datos
});


// Hacemos accesible la BBDD en los controllers a través de app.locals
app.locals.db = db;

app.use('/gatos', gatoRoutes);
app.use('/propietarios', propietarioRoutes);


//--------------------Abro un servidor en el puerto 8080-------------------------------------

app.listen(config.port, () => {
    console.log("El backend se ha iniciado");
});

module.exports =  { app };