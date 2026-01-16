const express = require("express");
const router = express.Router();
const tiendaCTl = require('../controller/tienda.controller');

// =====================
// API TIENDAS
// =====================

// Obtener todas las tiendas
router.get('/api/tiendas', tiendaCTl.listarTiendas);

// Obtener tienda por ID
router.get('/api/tiendas/:id', tiendaCTl.obtenerTienda);

// Crear tienda
router.post('/api/tiendas', tiendaCTl.crearTienda);

// Actualizar tienda
router.put('/api/tiendas/:id', tiendaCTl.actualizarTienda);

// Eliminar tienda
router.delete('/api/tiendas/:id', tiendaCTl.eliminarTienda);

// 🔹 Obtener la tienda del dueño (si NO usas middleware)
router.get('/api/tiendas/mi/:idDueño', async (req, res) => {
  try {
    const idDueño = req.params.idDueño;

    const tienda = await require('../../Database/dataBase.orm')
      .tienda.findOne({ where: { idDueño } });

    if (!tienda) {
      return res.status(404).json({ message: 'Tienda no encontrada' });
    }

    res.json(tienda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
