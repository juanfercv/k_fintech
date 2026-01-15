const express = require("express");
const router = express.Router();
const configuracionController = require('../controller/configuracion.controller');

// API endpoints para Configuración General del Sistema

// Parámetros del sistema
router.get('/api/configuracion/parametros', configuracionController.getParametros);
router.put('/api/configuracion/parametros', configuracionController.updateParametros);

// Roles
router.get('/api/configuracion/roles', configuracionController.getRoles);
router.post('/api/configuracion/roles', configuracionController.createRol);
router.put('/api/configuracion/roles/:id', configuracionController.updateRol);

// Usuarios
router.get('/api/configuracion/usuarios', configuracionController.getUsuarios);
router.post('/api/configuracion/usuarios', configuracionController.createUsuario);
router.put('/api/configuracion/usuarios/:id', configuracionController.updateUsuario);
router.delete('/api/configuracion/usuarios/:id', configuracionController.deleteUsuario);

// Integraciones
router.get('/api/configuracion/integraciones', configuracionController.getIntegraciones);
router.post('/api/configuracion/integraciones', configuracionController.createIntegracion);
router.put('/api/configuracion/integraciones/:id', configuracionController.updateIntegracion);

module.exports = router;