const cliente=(sequelize,type)=>{
    return sequelize.define('clientes',{
        id_cliente:{
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement:true 
        },
        nombre_cliente: type.STRING,
        direccion_cliente: type.STRING,
        correo_cliente: type.STRING,
        celular_cliente: type.STRING,
        cedula_cliente: type.STRING,
        estado: {
            type: type.ENUM('ACTIVO', 'INACTIVO'),
            defaultValue: 'ACTIVO'
        },

        crearCliente:{
            type:'TIMESTAMP',
            defaultValue: type.literal('CURRENT_TIMESTAMP'),
            allowNull:false
        },
        actualizarCliente:{
            type:'TIMESTAMP',
            defaultValue: type.literal('CURRENT_TIMESTAMP'),
            allowNull:false
        }
    }, {
        timestamps:false,
    });
}
module.exports = cliente