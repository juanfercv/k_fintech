const forma_pago=(sequelize,type)=>{
    return sequelize.define('forma_pagos',{
        id_forma_pago:{
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement:true 
        },
        nombre: type.STRING,
        descripcion: type.STRING,
        activo: {
            type: type.BOOLEAN,
            defaultValue: true
        },

        crearFormaPago:{
            type:'TIMESTAMP',
            defaultValue: type.literal('CURRENT_TIMESTAMP'),
            allowNull:false
        },
        actualizarFormaPago:{
            type:'TIMESTAMP',
            defaultValue: type.literal('CURRENT_TIMESTAMP'),
            allowNull:false
        }
    }, { timestamps:false,

    });

}
module.exports = forma_pago