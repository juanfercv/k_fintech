const express = require("express");
const router = express.Router();

// Importar rutas
const authRouter = require('./auth.api.router');
const clienteRouter = require('./cliente.api.router');
const tiendaRouter = require('./tienda.api.router');
const formaPagoRouter = require('./forma_pago.api.router');
const facturaRouter = require('./factura.api.router');
const dashboardRouter = require('./dashboard.api.router');
const { Mostrar } = require ('../controller/index.controller');

// Ruta principal
router.get('/', Mostrar);

// Usar rutas
router.use('/api', authRouter);
router.use('/api', clienteRouter);
router.use('/api', tiendaRouter);
router.use('/api', formaPagoRouter);
router.use('/api', facturaRouter);
router.use('/api', dashboardRouter);

module.exports = router;