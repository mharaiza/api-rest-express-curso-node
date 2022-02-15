const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');

const usuarios = require('./routes/usuarios');
const express = require('express');
const config = require('config');
const morgan = require('morgan')
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
//cuando se reciba la ruta [/api/usuarios] hacer uso deñ middelware [usuarios]
app.use('/api/usuarios', usuarios);

//configuracion de entornos
console.log('Aplicacion: ' + config.get('nombre'));
console.log('BD server: ' + config.get('configDB.host'));

//uso de un middleware de tercero
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    debug('Morgn está habilitado');
}
debug('Conectando con la base de datos');

app.get('/', (req, res) => {
    res.send('Hola mundo desde express.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
});