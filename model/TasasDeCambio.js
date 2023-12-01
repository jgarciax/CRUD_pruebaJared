const mongoose = require('mongoose');

const TasasDeCambioSchema = mongoose.Schema({
    moneda: String,
    tasa:Number
}, {
    timestamps: true
});

module.exports = mongoose.model('TasasDeCambio', TasasDeCambioSchema);