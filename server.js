//Se importaran las herramientas de uso de funcion y db
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const TasasDeCambio = require('../prueba/model/TasasDeCambio');

//Crea la aplicacion express
const app = express();

//configura el midleware del analisis
app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());
//se solicitara servir archivos staticos a la capeta public
app.use(express.static(path.join(__dirname, 'public')));
//CONEXION A LA BASE DE DATOS
mongoose.connect('mongodb://localhost:27017/tasasDeCambio', { //local predeterminado de mongoDB
   // useUrlParser: true
}).then(() => {
    console.log('conexion exitosa a la base de datos:D');
}).catch(err => {
    console.log('No se pudo conectar a la base de datos.', err)
    process.exit();
})


//Define las rutas para poder, crear, obtener,atualiar y eliminar tasas e cambio
// Se definiran las rutas 
app.post('/tasasDeCambio', (req, res) => {
    //se crearan nuevas tasas de Cambio
    const tasaDeCambio = new TasasDeCambio({
        moneda: req.body.moneda,
        tasa: req.body.tasa
    });
    //Funcion para guardar la tasa de cambio en la db
    tasaDeCambio.save()
    .then(data => {
        res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Ocurrion un error al intentar crear la tasa de cambio'
            });
        });
    });

    //ruta para servir el archivo.index.html
//Se busca conseguir las tasas de cambios
app.get('/tasasDeCambio', (req, res) => {
    TasasDeCambio.find()
    .then(tasasDeCambio => {
        res.send(tasasDeCambio);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrio un error al intentar obtener las tasas"
        });
    });
});

app.put('/tasasDeCambio/:tasaId', (req, res) => {
    //Funcion para actualizar tasas de cambio por medio del id
    TasasDeCambio.findByIdAndUpdate(req.params.tasaId, {
        moneda: req.body.moneda,
        tasa: req.body.tasa
    }, {new: true})
    .then(tasaDeCambio => {
        if(!tasaDeCambio) {
            return res.status(404).send({
                message: "No se hayo una tasa de cambio con el Id" +req.params.tasaId
            });
        }
        res.send(tasaDeCambio); 
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: 'No se encontro la tasa de cambio con el Id' + req.params.tasaId
            });
        }
        return res.status(500).send({
            message: 'Ocurrio un error al actualizar la tasa  de cambbio con el id' +req.params.tasaId
        });
    });
});
//Funcion para eliminar tasas de cambio
app.delete('/tasasDeCambio/:tasaId', (req, res) => {
    TasasDeCambio.findByIdAndRemove(req.params.tasaId) 
    .then(tasaDeCambio => {
        if(!tasaDeCambio) {
            return res.status(404).send({
                message: 'No se encontro una tasa de cambio con el id dlt' + req.params.tasaId
            });
        }
        res.send({message: 'Tasa de cambios eliminada exitosamente:D'});
    }).catch(eer => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: 'No se encontro una tasa de cambios con el Id' + req.params.tasaId
            })
        }
        return res.status(500).send({
            message: 'No se pudo borrar la tasa de cambio con el id' +req.params.tasaId
        });
    });
});
// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(8080, () => {
    console.log('El servidor esta corriendo en el puerto 8080:D')
});
