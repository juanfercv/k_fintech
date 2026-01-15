const express = require('express');
const rutas = express.Router()
const { Mostrar, mandar, traer } = require('../controller/factura.controller');

const { isLoggedIn } = require('../../lib/auth');

// rutas.get('/factura/agregar/:id', isLoggedIn, mostrar)
rutas.get('/factura/add/:id', isLoggedIn, Mostrar)
rutas.post('/add/:id', isLoggedIn, mandar)

module.exports = rutas 