const formaPagoCtl = {};

const orm = require('../../Database/dataBase.orm');

// API methods for payment methods (forma_pago)
formaPagoCtl.listarFormasPago = async (req, res) => {
    try {
        const formasPago = await orm.forma_pago.findAll();
        // Transform data to match frontend expectations
        const transformedData = formasPago.map(fp => ({
            id: fp.id_forma_pago,
            nombre: fp.nombre,
            descripcion: fp.descripcion,
            activo: fp.activo
        }));
        res.json(transformedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

formaPagoCtl.obtenerFormaPago = async (req, res) => {
    try {
        const id = req.params.id;
        const formaPago = await orm.forma_pago.findByPk(id);
        if (formaPago) {
            // Transform data to match frontend expectations
            const transformedData = {
                id: formaPago.id_forma_pago,
                nombre: formaPago.nombre,
                descripcion: formaPago.descripcion,
                activo: formaPago.activo
            };
            res.json(transformedData);
        } else {
            res.status(404).json({ message: 'Forma de pago no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

formaPagoCtl.crearFormaPago = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        
        const nuevaFormaPago = {
            nombre,
            descripcion,
            activo: true
        };
        
        const resultado = await orm.forma_pago.create(nuevaFormaPago);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

formaPagoCtl.actualizarFormaPago = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, descripcion, activo } = req.body;
        
        const formaPagoActualizada = {
            nombre,
            descripcion,
            activo
        };
        
        const formaPago = await orm.forma_pago.findByPk(id);
        if (formaPago) {
            await formaPago.update(formaPagoActualizada);
            res.json(formaPago);
        } else {
            res.status(404).json({ message: 'Forma de pago no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

formaPagoCtl.eliminarFormaPago = async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await orm.forma_pago.destroy({ where: { id_forma_pago: id } });
        if (resultado) {
            res.json({ message: 'Forma de pago eliminada exitosamente' });
        } else {
            res.status(404).json({ message: 'Forma de pago no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

formaPagoCtl.listarFormasPagoActivas = async (req, res) => {
    try {
        const formasPago = await orm.forma_pago.findAll({ where: { activo: true } });
        // Transform data to match frontend expectations
        const transformedData = formasPago.map(fp => ({
            id: fp.id_forma_pago,
            nombre: fp.nombre,
            descripcion: fp.descripcion,
            activo: fp.activo
        }));
        res.json(transformedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = formaPagoCtl;