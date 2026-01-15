const factura = (sequelize, type) => {
    return sequelize.define('facturas', {
        idFactura: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fecha_emision: type.STRING,
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
        estado_factura: type.STRING,
        total: type.DECIMAL(10, 2),

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
