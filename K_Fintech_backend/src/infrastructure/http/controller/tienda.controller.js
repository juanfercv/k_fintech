const tiendaCTl = {}

const { Path } = require('path');

// Desde carpeta 'root'
const orm = require('../../Database/dataBase.orm');

// API methods for frontend
tiendaCTl.listarTiendas = async (req, res) => {
    try {
        const tiendas = await orm.tienda.findAll();
        res.json(tiendas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

tiendaCTl.obtenerTienda = async (req, res) => {
    try {
        const id = req.params.id;
        const tienda = await orm.tienda.findByPk(id);
        if (tienda) {
            res.json(tienda);
        } else {
            res.status(404).json({ message: 'Tienda no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

tiendaCTl.crearTienda = async (req, res) => {
    try {
        const { fotoTienda, nombreTienda, dueñoTienda, RUCTienda, dirección_matriz_tienda, direccion_sucursal_tienda, correo_electronico_tienda, telefono } = req.body;
        const nuevaTienda = {
            fotoTienda,
            nombreTienda,
            dueñoTienda,
            RUCTienda,
            dirección_matriz_tienda,
            direccion_sucursal_tienda,
            correo_electronico_tienda,
            telefono
        };
        const resultado = await orm.tienda.create(nuevaTienda);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

tiendaCTl.actualizarTienda = async (req, res) => {
    try {
        const id = req.params.id;
        const { fotoTienda, nombreTienda, dueñoTienda, RUCTienda, dirección_matriz_tienda, direccion_sucursal_tienda, correo_electronico_tienda, telefono } = req.body;
        const tiendaActualizada = {
            fotoTienda,
            nombreTienda,
            dueñoTienda,
            RUCTienda,
            dirección_matriz_tienda,
            direccion_sucursal_tienda,
            correo_electronico_tienda,
            telefono
        };
        const tienda = await orm.tienda.findOne({ where: { idTienda: id } });
        if (tienda) {
            await tienda.update(tiendaActualizada);
            res.json(tienda);
        } else {
            res.status(404).json({ message: 'Tienda no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

tiendaCTl.eliminarTienda = async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await orm.tienda.destroy({ where: { idTienda: id } });
        if (resultado) {
            res.json({ message: 'Tienda eliminada exitosamente' });
        } else {
            res.status(404).json({ message: 'Tienda no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Existing view methods
tiendaCTl.mostrar = (req, res) => {
    res.render('tienda/agregar');
}

tiendaCTl.mandar = async (req, res) => {
    const id = req.user.idDueño
    const { idTienda, fotoTienda, nombreTienda, dueñoTienda, RUCTienda, dirección_matriz_tienda, direccion_sucursal_tienda, correo_electronico_tienda, telefono } = req.body
    const NuevoTienda = {
        fotoTienda,
        nombreTienda,
        dueñoTienda,
        RUCTienda,
        dirección_matriz_tienda,
        direccion_sucursal_tienda,
        correo_electronico_tienda,
        telefono
    }
    await orm.tienda.create(NuevoTienda)
    res.redirect('/tienda/lista/' + id);
}

tiendaCTl.lista = async (req, res) => {
    const lista = await orm.tienda.findAll()
    res.render('tienda/lista', { lista })
}

tiendaCTl.traer = async (req, res) => {
    const ids = req.params.id
    const lista = await orm.tienda.findByPk(ids)
    res.render('tienda/editar', {lista})
}

tiendaCTl.actualizar = async (req, res) => {
    const id = req.user.idDueño
    const ids = req.params.id
    const { idTienda, fotoTienda, nombreTienda, dueñoTienda, RUCTienda, dirección_matriz_tienda, direccion_sucursal_tienda, correo_electronico_tienda, telefono } = req.body
    const nuevaShop = {
        fotoTienda,
        dueñoTienda,
        nombreTienda,
        RUCTienda,
        dirección_matriz_tienda,
        direccion_sucursal_tienda,
        correo_electronico_tienda,
        telefono,
    }
    await orm.tienda.findOne({ where: {idTienda: ids } })
        .then(actualizar => {
            actualizar.update(nuevaShop)
            req.flash('success', 'Actualizado con extio')
        })

        res.redirect('/tienda/lista/' + ids);
}

module.exports = tiendaCTl;