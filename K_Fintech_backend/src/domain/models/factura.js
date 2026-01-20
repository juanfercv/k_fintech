const factura = (sequelize, type) => {
    return sequelize.define('facturas', {
        idFactura: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fecha_emision: {
            type: type.STRING,
            allowNull: false
        },
        idTienda: {
            type: type.INTEGER,
            allowNull: true
        },
        idCliente: {
            type: type.INTEGER,
            allowNull: true
        },
        idFormaPago: {
            type: type.INTEGER,
            allowNull: true
        },
        estado_factura: {
            type: type.STRING,
            defaultValue: 'Pendiente',
            allowNull: false
        },
        detalle: {
            type: type.TEXT,
            allowNull: true,
            defaultValue: ''
        },
        total: {
            type: type.DECIMAL(10, 2),
            defaultValue: 0,
            allowNull: false
        },

        crearFactura: {
            type: 'TIMESTAMP',
            defaultValue: type.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        actualizarFactura: {
            type: 'TIMESTAMP',
            defaultValue: type.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        }
    }, {
        timestamps: false,
    });
};

module.exports = factura;
