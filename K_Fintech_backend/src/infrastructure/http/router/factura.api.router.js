const express = require("express");
const router = express.Router();
const facturaController = require('../controller/factura.controller');

router.get('/api/facturas', facturaController.listarFacturas);
router.get('/api/facturas/:id', facturaController.obtenerFactura);
router.post('/api/facturas', facturaController.crearFactura);
router.post('/api/add/:id', facturaController.crearDetalle);

module.exports = router;
