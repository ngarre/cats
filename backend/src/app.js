//Cargar librerías
const express = require('express'); //Framework web para Node.js que te permite crear servidores de manera rápida
const cors = require('cors'); //Controla políticas de acceso de tu servidor, en este caso Express
const knex = require('knex'); //Librería de JavaScript para Node.js que sirve como un constructor de consultas SQL
const { check, validationResult } = require('express-validator');

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



//------------------CRUD GATOS (4 OPERACIONES BÁSICAS: registrar, visualizar, editar y eliminar)---------------------------------------

app.get('/gatos', async (req, res) => {  //Operación para ver todos los gatos que hay en la BBDD
    const cats = await db('gatos').select('*'); //Le pides todos los campos de la BBDD
    res.json(cats);
});

app.get('/gatos/:id', async (req, res) => { //Operación para ver info de un gato en concreto dado un id
    const cats = await db('gatos').select('*').where({ id: req.params.id }).first();
    res.json(cats); //Devuelve la infromación del gato cuyo id se ha proporcionado
});

app.post('/gatos', [check('nombre').notEmpty().withMessage('El nombre del gatito es obligatorio')], async (req, res) => {
    try {
        // Verificar si hay errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Operación para dar de alta gatos en la BBDD
        await db('gatos').insert({
            nombre: req.body.nombre,
            edad: req.body.edad,
            raza: req.body.raza,
            propietario: req.body.propietario,
            id_propietario: req.body.id_propietario,
        });
        res.status(201).json({ message: 'Gatito registrado exitosamente' }); // Respuesta exitosa
    } catch (error) {
        console.error('Error al registrar al gatito:', error); // Log del error en la consola
        res.status(500).json({ error: 'Ocurrió un error al registrar al gatito', details: error.message }); // Respuesta con error
    }
});

app.put('/gatos/:id', async (req, res) => { //Dado un id concreto, modificamos los datos del gato correspondiente
    await db('gatos').update({
        nombre: req.body.nombre,
        edad: req.body.edad,
        raza: req.body.raza,
        propietario: req.body.propietario
    }).where({ id: req.params.id });
    res.status(200).json({});
});

app.delete('/gatos/:id', async (req, res) => { //Borrar gatos :c
    await db('gatos').del().where({ id: req.params.id });

    res.status(204).json({});
});




//------------------------------------------CRUD PROPIETARIOS------------------------------------------------------------

app.get('/propietarios', async (req, res) => {  //Operación para ver todos los propietarios que hay en la BBDD
    const prop = await db('propietarios').select('*'); //Le pides todos los campos de la BBDD
    res.json(prop);
});

app.get('/propietarios/:id', async (req, res) => { //Operación para ver info de un propietario en concreto dado un id
    const prop = await db('propietarios').select('*').where({ id: req.params.id }).first();
    res.json(prop); //Devuelve la infromación del propietario cuyo id se ha proporcionado
});

app.get('/propietarios/buscar/:nickname', async (req, res) => { //Operación para ver info de un propietario en concreto dado un id
    const prop = await db('propietarios').select('*').where({ nickname: req.params.nickname }).first(); //Esto realmente podría sobrar ya que el parametro de nickname es UNIQUE, pero no está demás como medida de seguridad
    res.json(prop); //Devuelve la información del propietario cuyo nickname se ha proporcionado
});

app.post('/propietarios', [check('nickname').notEmpty().withMessage('El nickname del usuario es obligatorio')], async (req, res) => {
    try {
        //Verifico si hay errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //Operación para dar de alta propietarios en la BBDD
        await db('propietarios').insert({
            nickname: req.body.nickname,
            nombre: req.body.nombre,
            edad: req.body.edad,
            nacionalidad: req.body.nacionalidad,
        });
        res.status(201).json({ message: 'Te has registrado exitosamente' }); //Respuesta exitosa
    } catch (error) {
        console.error('Error de registro:', error); // Log del error en la consola
        res.status(500).json({ error: 'Ocurrió un error al registrar', details: error.message }); //Respuesta con error
    }
});


app.put('/propietarios/:id', async (req, res) => { //Dado un nickname concreto, modificamos los datos del propietario correspondiente
    await db('propietarios').update({
        nickname: req.body.nickname,
        nombre: req.body.nombre,
        edad: req.body.edad,
        nacionalidad: req.body.nacionalidad,
    }).where({ id: req.params.id });
    res.status(200).json({});
});

app.delete('/propietarios/:id', async (req, res) => { //Borrar datos de propietario
    await db('propietarios').del().where({ id: req.params.id });

    res.status(204).json({});
});


//Operación para ver los gatos de un propietario
app.get('/propietarios/:id/gatos', async (req, res) => { 
    const prop = await db('gatos').select('*').where({ id_propietario: req.params.id });
    res.json(prop); 
});



//--------------------Abro un servidor en el puerto 8080-------------------------------------

app.listen(8080, () => {
    console.log("El backend ha iniciado en el puerto 8080");
})


