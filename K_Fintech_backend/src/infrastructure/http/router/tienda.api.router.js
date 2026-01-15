const express = require("express");
const router = express.Router();
const tiendaController = require('../controller/tienda.controller');

// API endpoints for tienda
router.get('/api/tiendas', tiendaController.listarTiendas);
router.get('/api/tiendas/:id', tiendaController.obtenerTienda);
router.post('/api/tiendas', tiendaController.crearTienda);
router.put('/api/tiendas/:id', tiendaController.actualizarTienda);
router.delete('/api/tiendas/:id', tiendaController.eliminarTienda);

module.exports = router;