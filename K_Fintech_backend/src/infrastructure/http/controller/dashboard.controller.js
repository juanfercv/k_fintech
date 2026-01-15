// controllers/dashboard.controller.js

const Cliente = require('../../domain/models/cliente');
const Tienda = require('../../domain/models/tienda');
const Factura = require('../../domain/models/factura');
const FormaPago = require('../../domain/models/forma_pago');
const DetalleFactura = require('../../domain/models/detalle_factura');
const DetalleTotal = require('../../domain/models/detalle_total');
const { Op } = require('sequelize');

// Controlador para las estadísticas del dashboard cliente
const getEstadisticasCliente = async (req, res) => {
  try {
    // Total facturado - relacionando factura con detalle_total
    const facturasConTotal = await Factura.findAll({
      include: [{
        model: DetalleTotal,
        attributes: ['valor_total'],
        required: true,
      }],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), 0, 1), // Desde el inicio del año
        },
      },
      raw: true,
    });
    
    const totalFacturado = facturasConTotal.reduce((sum, factura) => {
      return sum + parseFloat(factura['detalle_total.valor_total'] || 0);
    }, 0);

    // Facturas por estado - usando la tabla factura
    const facturasPorEstado = await Factura.findAll({
      attributes: ['estado', [Factura.sequelize.fn('COUNT', Factura.sequelize.col('estado')), 'count']],
      group: ['estado'],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), 0, 1), // Desde el inicio del año
        },
      },
    });

    // Top clientes - relacionando cliente con factura y detalle_total
    const topClientes = await Cliente.findAll({
      attributes: ['nombre_cliente', 'id_cliente'],
      include: [{
        model: Factura,
        required: false,
        include: [{
          model: DetalleTotal,
          attributes: [],
          required: true,
        }],
      }],
      order: [[Factura, DetalleTotal, 'valor_total', 'DESC']],
      limit: 5,
    });

    // Métodos de pago más usados
    const metodosPagoMasUsados = await FormaPago.findAll({
      attributes: ['nombre', 'id_forma_pago'],
      include: [{
        model: Factura,
        attributes: [[Factura.sequelize.fn('COUNT', Factura.sequelize.col('id_forma_pago')), 'uso']],
        group: ['Factura.id_forma_pago'],
        required: false,
      }],
      order: [[Factura, 'uso', 'DESC']],
      limit: 5,
    });

    res.json({
      totalFacturado: parseFloat(totalFacturado) || 0,
      facturasPorEstado: facturasPorEstado,
      topClientes: topClientes,
      metodosPagoMasUsados: metodosPagoMasUsados,
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ message: 'Error obteniendo estadísticas', error: error.message });
  }
};

module.exports = {
  getEstadisticasCliente,
};