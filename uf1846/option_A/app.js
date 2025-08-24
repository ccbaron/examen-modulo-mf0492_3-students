const express = require('express');
const mongoose = require('mongoose');
const Patient = require('./models/patient');
const { logRequest } = require('./utils/utils'); // Importamos la función de logging desde utils.js (registroa las consultas en YYYY-MM-DD.txt)

const app = express();

// Conexión a la base de datos con Mongoose (nueva sintaxis)
mongoose.connect('mongodb+srv://sololectura:sololectura@cluster0.c8tq0vp.mongodb.net/catsalut')
    .then(() => console.log('Conectado a la base de datos'))
    .catch(err => console.error('Error al conectar a la base de datos', err));


// Configuración de EJS como motor de plantillas
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // Middleware integrado para manejar formularios
app.use(express.json()); // Middleware integrado para manejar JSON

// Nueva ruta: Página de inicio
app.get('/', async (req, res) => {
    try {
        const totalPatients = await Patient.countDocuments(); // // countDocuments() devuelve un número con el total de registros
        // Pasamos la variable a home.ejs para que la muestre
        res.render('home', { totalPatients }); // Renderizar la vista 'home' con el total de pacientes
    } catch (err) {
        res.status(500).send('Error al cargar la página de inicio');
    }
});

// Endpoint 1: Obtener todos los pacientes en formato JSON en la ruta /api/patients
app.get('/api/patients', async (req, res) => {
    try {
        // .find({}) trae todos. .lean() -> objetos JS "planos" (más rápidos para JSON)
        // Proyección { __v: 0 } para ocultar el campo interno de Mongoose
        const patients = await Patient.find({}, { __v: 0 }).lean();
        res.json(patients); // Devolvemos directamente el array (formato API estándar)
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener pacientes' });
    }
});

// Endpoint 2: Renderizar el formulario de búsqueda
app.get('/form', (req, res) => {
    // form.ejs debe tener un <form method="GET" action="/check"> con <input name="ssn" />
    res.render('form');
});

// Endpoint 3: Verificar si el paciente existe y mostrar información
app.get('/check', async (req, res) => {
    // Leemos el parámetro de query (?ssn=...)
    const { ssn } = req.query; // Obtener SSN del query string (?ssn=...)

    // Validación básica: si no viene, devolvemos 400 (petición incorrecta)
    if (!ssn) {
        return res.status(400).send('Falta el número de la Seguridad Social');
    }
    try {
        // Registramos la consulta en un fichero YYYY-MM-DD.txt
        logRequest(`Se ha realizado una consulta sobre el paciente número ${ssn}`);

        // Buscar paciente por SSN exacto
        const patient = await Patient.findOne({ ssn: ssn });

        if (patient) {
            // Si existe, renderizamos patient-info.ejs con los datos del paciente
            res.render('patient-info', { patient });

        } else {
            // Si no existe, renderizamos patient-info.ejs con mensaje de error
            res.render('patient-info', { patient: null, message: 'El paciente no existe en la base de datos' });
        }
    } catch (err) {
        res.status(500).send('Error al verificar el paciente');
    }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
