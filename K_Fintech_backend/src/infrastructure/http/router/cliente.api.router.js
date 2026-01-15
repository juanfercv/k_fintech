const express = require("express");
const router = express.Router();
const clienteController = require('../controller/cliente.controller');

// API endpoints for cliente
router.get('/api/clientes', clienteController.listarClientes);
router.get('/api/clientes/:id', clienteController.obtenerCliente);
router.post('/api/clientes', clienteController.crearCliente);
router.put('/api/clientes/:id', clienteController.actualizarCliente);
router.delete('/api/clientes/:id', clienteController.eliminarCliente);

module.exports = router;