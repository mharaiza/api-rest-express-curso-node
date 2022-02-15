const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');

const express = require('express');
const config = require('config');
// logger = require('./logger');
const morgan = require('morgan')
const Joi = require('@hapi/joi');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));


//configuracion de entornos
console.log('Aplicacion: ' + config.get('nombre'));
console.log('BD server: ' + config.get('configDB.host'));

//uso de un middleware de tercero
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    //console.log('Morgan habilitado');
    debug('Morgn está habilitado');
}


debug('Conectando con la base de datos');

//app.use(logger);
// app.use(function (req, res, next){
//     console.log('Autenticando...');
//     next();
// });

const usuarios = 
[
    {id:1, nombre:'Mau'},
    {id:2, nombre:'Juan'},
    {id:3, nombre:'Luis'}
];

app.get('/', (req, res) => {
    res.send('Hola mundo desde express.');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if(!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

app.post('/api/usuarios/', (req, res) => {
    // let body = req.body;
    // console.log(body.nombre);
    // res.json({

    //     body
    // });

    const {error,value} = validarUsuario(req.body.nombre);
    if(!error){
        const usuario = {
            id: usuarios.length + 1, 
            nombre: value.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
    }else{
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }
});


app.put('/api/usuarios/:id', (req, res) => {
    //encontrar si existe el usuario
    
    //let usuario = usuarios.find(u => u.id === parseInt( req.params.id));
    let usuario = existeUsuario(req.params.id);

    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 

    //const {error,value}  = schema.validate({ nombre: req.body.nombre });
    const {error,value} = validarUsuario(req.body.nombre);

    if(error){
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
});


app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);

    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 

    const index = usuarios.indexOf(usuario);

    usuarios.splice(index, 1);

    res.send(usuario);

});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
});


function existeUsuario(id){
    return usuarios.find(u => u.id === parseInt( id ));
}

function validarUsuario(nom){

    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });

    return (schema.validate({ nombre: nom }));
}