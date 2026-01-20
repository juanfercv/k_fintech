const facturaCtl = {};
const orm = require('../../Database/dataBase.orm');

// LISTAR FACTURAS
facturaCtl.listarFacturas = async (req, res) => {
    try {
        const facturas = await orm.factura.findAll({
            include: [{ model: orm.forma_pago }, { model: orm.cliente }, { model: orm.tienda }]
        });
        res.json(facturas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// OBTENER FACTURA CON DETALLES + TOTALES
facturaCtl.obtenerFactura = async (req, res) => {
    try {
        const id = req.params.id;

        const factura = await orm.factura.findOne({
            where: { idFactura: id },
            include: [
                { model: orm.detalle_factura },
                { model: orm.cliente },
                { model: orm.tienda },
                { model: orm.forma_pago }
            ]
        });

        if (!factura) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

        const detalles = factura.detalle_facturas || [];

        const subtotal = detalles.reduce(
            (acc, d) => acc + Number(d.precio_total),
            0
        );

        const iva = Number((subtotal * 0.15).toFixed(2));
        const total = Number((subtotal + iva).toFixed(2));

        res.json({
            ...factura.toJSON(),
            detalles,
            subtotal,
            iva,
            total
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// CREAR FACTURA
facturaCtl.crearFactura = async (req, res) => {
    try {
        const { idTienda, idCliente, idFormaPago, fecha_emision, estado_factura, total, detalle } = req.body;

        const factura = await orm.factura.create({
            idTienda,
            idCliente,
            idFormaPago,
            fecha_emision,
            estado_factura: estado_factura || 'Pendiente',
            total: total || 0,
            detalle: detalle || ''
        });

        res.status(201).json(factura);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ACTUALIZAR FACTURA
facturaCtl.actualizarFactura = async (req, res) => {
    try {
        const id = req.params.id;
        const { idTienda, idCliente, idFormaPago, fecha_emision, estado_factura, total, detalle } = req.body;

        const factura = await orm.factura.findOne({ where: { idFactura: id } });

        if (!factura) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

        await factura.update({
            idTienda,
            idCliente,
            idFormaPago,
            fecha_emision,
            estado_factura: estado_factura || factura.estado_factura,
            total: total !== undefined ? total : factura.total,
            detalle: detalle !== undefined ? detalle : factura.detalle
        });

        res.json(factura);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ELIMINAR FACTURA
facturaCtl.eliminarFactura = async (req, res) => {
    try {
        const id = req.params.id;

        const factura = await orm.factura.findOne({ where: { idFactura: id } });

        if (!factura) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

        await factura.destroy();
        res.json({ message: 'Factura eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREAR DETALLE DE FACTURA
facturaCtl.crearDetalle = async (req, res) => {
    try {
        const idFactura = req.params.id;
        const { descripcion, cantidad, precio_unitario, precio_total } = req.body;

        const detalle = await orm.detalle_factura.create({
            idFactura,
            descripcion,
            cantidad,
            precio_unitario,
            precio_total
        });

        res.status(201).json(detalle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = facturaCtl;
