const dueño = (sequelize,type)=>{
    return sequelize.define('dueños',{
        idDueño:{
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement:true 
        },
        nombres_Dueño: type.STRING,
        apellidos_Dueño:type.STRING,
        cedula_Dueño:type.STRING,
        celular_Dueño:type.STRING,
        correo_electronico_Dueño:type.STRING,
        password_Dueño: type.STRING,

        crearDueño:{
            type:'TIMESTAMP',
            defaultValue: type.literal('CURRENT_TIMESTAMP'),
            allowNull:false
        },
        actualizarDueño:{
            type:'TIMESTAMP',
            defaultValue: type.literal('CURRENT_TIMESTAMP'),
            allowNull:false
        }
    }, {
        timestamps:false,
    });

}

module.exports = dueño