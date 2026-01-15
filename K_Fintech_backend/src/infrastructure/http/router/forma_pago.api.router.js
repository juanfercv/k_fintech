const express = require("express");
const router = express.Router();
const formaPagoController = require('../controller/forma_pago.controller');

// API endpoints for forma_pago (payment methods)
router.get('/api/formas_pago', formaPagoController.listarFormasPago);
router.get('/api/formas_pago/activas', formaPagoController.listarFormasPagoActivas);
router.get('/api/formas_pago/:id', formaPagoController.obtenerFormaPago);
router.post('/api/formas_pago', formaPagoController.crearFormaPago);
router.put('/api/formas_pago/:id', formaPagoController.actualizarFormaPago);
router.delete('/api/formas_pago/:id', formaPagoController.eliminarFormaPago);

module.exports = router;