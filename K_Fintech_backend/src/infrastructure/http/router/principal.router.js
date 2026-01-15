const express = require("express");
const rutas = express.Router()

const { mostrar, Mostrar} = require('../controller/principal.controller')

rutas.get('/principal', mostrar)
rutas.get('/agregar', Mostrar)

module.exports = rutas
