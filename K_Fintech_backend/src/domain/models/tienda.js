const tienda=(sequelize,type)=>{
    return sequelize.define('tiendas',{
        idTienda:{
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement:true 
        },
        fotoTienda: type.STRING,
        nombreTienda: type.STRING,
        dueñoTienda: type.STRING,
        RUCTienda: type.STRING,
        dirección_matriz_tienda: type.STRING,
        direccion_sucursal_tienda: type.STRING,
        correo_electronico_tienda: type.STRING,
        telefono: type.STRING,

        crearTienda:{
            type:'TIMESTAMP',
            defaultValue: type.literal('CURRENT_TIMESTAMP'),
            allowNull:false
        },
        actualizarTienda:{
            type:'TIMESTAMP',
            defaultValue: type.literal('CURRENT_TIMESTAMP'),
            allowNull:false
        }
    }, { timestamps:false,

    });

}
module.exports = tienda