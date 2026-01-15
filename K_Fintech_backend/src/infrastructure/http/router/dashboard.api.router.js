// src/infrastructure/http/router/dashboard.api.router.js

const { Router } = require('express');
const { getEstadisticasCliente } = require('../controller/dashboard.controller');

const router = Router();

// Ruta para obtener las estadísticas del dashboard cliente
router.get('/dashboard/cliente', getEstadisticasCliente);

module.exports = router;