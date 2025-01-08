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

//CRUD (4 OPERACIONES BÁSICAS: registrar, visualizar, editar y eliminar)

app.get('/cats', async (req, res) => {  //Operación para ver todos los gatos que hay en la BBDD
    const cats = await db('cats').select('*'); //Le pides todos los campos de la BBDD
    res.json(cats);
});

app.get('/cats/:id', async (req, res) => { //Operación para ver info de un gato en concreto dado un id
    const cats = await db('cats').select('*').where({ id: req.params.id }).first();
    res.json(cats); //Devuelve la infromación del gato cuyo id se ha proporcionado
});

app.post('/cats', async (req, res) => {
    try {
        // Operación para dar de alta gatos en la BBDD
        await db('cats').insert({
            nombre: req.body.nombre,
            edad: req.body.edad,
            raza: req.body.raza,
            propietario: req.body.propietario
        });
        res.status(201).json({ message: 'Gatito registrado exitosamente' }); // Respuesta exitosa
    } catch (error) {
        console.error('Error al registrar al gatito:', error); // Log del error en la consola
        res.status(500).json({ error: 'Ocurrió un error al registrar al gatito', details: error.message }); // Respuesta con error
    }
});


app.put('/cats/:id', async (req, res) => { //Dado un id concreto, modificamos los datos del gato correspondiente
    await db('cats').update({
        nombre: req.body.nombre,
        edad: req.body.edad,
        raza: req.body.raza,
        propietario: req.body.propietario
    }).where({ id: req.params.id });
    res.status(200).json({});
});

app.delete('/cats/:id', async (req, res) => { //Borrar gatos :c
    await db('cats').del().where({ id: req.params.id });

    res.status(204).json({});
});


app.listen(8080, () => {
    console.log("El backend ha iniciado en el puerto 8080");
})

