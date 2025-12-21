/* 
  Importamos el framework Express para crear el servidor web de manera sencilla y manejar rutas.
  Express nos permite recibir peticiones HTTP (del frontend) y enviar respuestas.
*/
const express = require('express');
/* 
  Importamos Axios para realizar peticiones HTTP a otros sitios web (como si fuera un navegador).
  Lo usaremos para "visitar" la página del BCV y descargar su contenido.
*/
const axios = require('axios');

/* 
  Importamos Cheerio, una librería que nos permite analizar (parsear) código HTML.
  Funciona de manera muy similar a jQuery, permitiéndonos buscar elementos usando selectores (ej. #id, .clase).
*/
const cheerio = require('cheerio');

/* 
  Importamos el módulo nativo HTTPS de Node.js. 
  Lo necesitamos para configurar un "agente" personalizado que maneje la seguridad de la conexión.
*/
const https = require('https');

// Inicializamos la aplicación de Express
const app = express();

/*
  Definimos el puerto en el que escuchará nuestro servidor.
  Usamos el 5000 para evitar conflictos con React (que suele usar el 3000 o 5173).
*/
const PORT = 5000;

/*
  Configuramos un agente HTTPS personalizado.
  Problema: La página del BCV (bcv.org.ve) a menudo tiene certificados SSL auto-firmados o que Node.js considera inseguros.
  Solución: 'rejectUnauthorized: false' le dice a Axios que ignore estos errores de validación de certificado 
  y continúe con la conexión de todas formas. Es necesario para que el scraping no falle.
*/
const agent = new https.Agent({
    rejectUnauthorized: false
});

/*
  Middleware para manejo de CORS (Cross-Origin Resource Sharing) MANUAL.
  Esto es CRÍTICO para que tu frontend (ej. React en localhost:3000) pueda pedir datos a este backend (en localhost:5000).
  Sin esto, el navegador bloquearía la petición por seguridad.
*/
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Permite que CUALQUIER dominio nos haga peticiones (útil para desarrollo)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Define qué cabeceras aceptamos
    next(); // Pasa la pelota a la siguiente función o ruta
});

/*
  Definimos la ruta (endpoint) GET para obtener la tasa.
  Cuando el frontend llame a 'http://localhost:5000/api/bcv', se ejecutará esta función.
  'async' indica que la función contiene operaciones que tardan tiempo (como ir a buscar la web del BCV).
*/
app.get('/api/bcv', async (res) => {
    try {
        /* 
          1. REALIZAR LA PETICIÓN:
          Usamos axios.get para descargar el HTML de la página del BCV.
          'await' pausa la ejecución aquí hasta que la página responda.
          Pasamos 'httpsAgent: agent' para evitar el error de certificado SSL mencionado arriba.
        */
        const response = await axios.get('https://www.bcv.org.ve/', { httpsAgent: agent });

        // Obtenemos el cuerpo de la respuesta, que es el código HTML completo de la página
        const html = response.data;

        /*
          2. CARGAR EL HTML:
          Cargamos ese HTML en Cheerio. La constante '$' se usa por convención (como en jQuery).
          Ahora podemos usar $('selector') para buscar cosas en ese HTML.
        */
        const $ = cheerio.load(html);

        /*
          3. EXTRAER EL DATO:
          Buscamos el elemento específico que contiene la tasa del dólar.
          - '#dolar': Busca un elemento con id="dolar".
          - ' strong': Dentro de ese elemento, busca una etiqueta <strong>.
          - .text(): Obtiene el texto que hay dentro (ej. " 35,4000 ").
          - .trim(): Elimina los espacios en blanco sobrantes del inicio y final.
        */
        const tasaTexto = $('#dolar strong').text().trim();

        /*
          4. LIMPIEZA Y CONVERSIÓN:
          El BCV suele devolver el número con coma decimal (ej. "35,4123") y a veces con más decimales.
          Para que sea útil en cálculos, lo convertimos a un número de JavaScript (float).
          - .replace(',', '.'): Cambiamos la coma por punto, que es el separador decimal en JS.
          - parseFloat(...): Convierte esa cadena de texto ya limpia en un número real.
        */
        const tasaNumerica = parseFloat(tasaTexto.replace(',', '.'));

        // Obtenemos la fecha y hora actual del servidor para saber cuándo se consultó
        const fechaConsulta = new Date().toISOString();

        /*
          5. ENVIAR RESPUESTA:
          Si todo salió bien, respondemos al cliente con un objeto JSON.
        */
        res.json({
            exito: true,               // Bandera para saber que la petición fu exitosa
            fuente: 'Banco Central de Venezuela', // Origen de los datos
            moneda_origen: 'USD',      // Monedad base
            moneda_destino: 'VED',     // Moneda destino
            tasa_numerica: tasaNumerica, // El valor numérico (float, ej: 35.4)
            fecha_consulta: fechaConsulta, // Timestamp de la consulta
            mensaje: 'Datos obtenidos exitosamente'
        });

    } catch (error) {
        /*
          MANEJO DE ERRORES:
          Si algo falla en el bloque 'try' (ej. la página del BCV está caída o cambió su estructura),
          el código salta inmediatamente aquí.
        */
        console.error('Error haciendo scraping al BCV:', error.message);

        // Respondemos con un código HTTP 500 (Error del servidor) y detalles del error
        res.status(500).json({
            exito: false,
            mensaje: 'Hubo un error al intentar obtener la tasa del BCV',
            error: error.message // Enviamos el mensaje técnico del error para depuración
        });
    }
});

/*
  INICIAR EL SERVIDOR:
  Le decimos a nuestra app que empiece a escuchar peticiones en el puerto configurado (5000).
*/
app.listen(PORT, () => {
    console.log(` Servidor de BCV API corriendo exitosamente!`);
    console.log(` Para probarlo, abre en tu navegador:`);
    console.log(` http://localhost:${PORT}/api/bcv`);
});