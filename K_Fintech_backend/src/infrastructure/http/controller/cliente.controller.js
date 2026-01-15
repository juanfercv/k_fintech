const clienteCTl = {}

// Desde carpeta 'root'
const orm = require('../../Database/dataBase.orm');

// API methods for frontend
clienteCTl.listarClientes = async (req, res) => {
    try {
        const clientes = await orm.cliente.findAll();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

clienteCTl.obtenerCliente = async (req, res) => {
    try {
        const id = req.params.id;
        const cliente = await orm.cliente.findByPk(id);
        if (cliente) {
            res.json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

clienteCTl.crearCliente = async (req, res) => {
    try {
        const { nombre_cliente, direccion_cliente, correo_cliente, celular_cliente, cedula_cliente } = req.body;
        const nuevoCliente = {
            nombre_cliente,
            direccion_cliente,
            correo_cliente,
            celular_cliente,
            cedula_cliente
        };
        const resultado = await orm.cliente.create(nuevoCliente);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

clienteCTl.actualizarCliente = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre_cliente, direccion_cliente, correo_cliente, celular_cliente, cedula_cliente, estado } = req.body;
        const clienteActualizado = {
            nombre_cliente,
            direccion_cliente,
            correo_cliente,
            celular_cliente,
            cedula_cliente,
            ...(estado && { estado }) // Solo incluir estado si se proporciona
        };
        const cliente = await orm.cliente.findOne({ where: { id_cliente: id } });
        if (cliente) {
            await cliente.update(clienteActualizado);
            res.json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

clienteCTl.eliminarCliente = async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await orm.cliente.destroy({ where: { id_cliente: id } });
        if (resultado) {
            res.json({ message: 'Cliente eliminado exitosamente' });
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = clienteCTl;