module.exports = (sequelize, DataTypes) => {
  const ParametroSistema = sequelize.define('ParametroSistema', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    clave: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    valor: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('string', 'number', 'boolean', 'json'),
      defaultValue: 'string'
    },
    descripcion: {
      type: DataTypes.STRING(255)
    },
    grupo: {
      type: DataTypes.STRING(50), // 'moneda', 'impuestos', 'documentos', etc.
      defaultValue: 'general'
    }
  }, {
    tableName: 'parametros_sistema',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  const Rol = sequelize.define('Rol', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.STRING(255)
    },
    nivel: {
      type: DataTypes.INTEGER,
      defaultValue: 3, // 1=admin general, 2=admin tienda, 3=cajero
      validate: {
        min: 1,
        max: 3
      }
    },
    permisos: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        tiendas: [],
        facturas: [],
        clientes: [],
        metodosPago: [],
        configuracion: []
      }
    }
  }, {
    tableName: 'roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombres: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellidos: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    tienda_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tiendas',
        key: 'idTienda'
      }
    },
    estado: {
      type: DataTypes.ENUM('activo', 'inactivo'),
      defaultValue: 'activo'
    },
    ultimo_login: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  const Integracion = sequelize.define('Integracion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    servicio: {
      type: DataTypes.ENUM('sri', 'correo', 'pasarela_pago', 'otros'),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    configuracion: {
      type: DataTypes.JSON,
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'integraciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Relaciones
  Rol.hasMany(Usuario, {
    foreignKey: 'rol_id',
    as: 'usuarios'
  });

  Usuario.belongsTo(Rol, {
    foreignKey: 'rol_id',
    as: 'rol'
  });

  return {
    ParametroSistema,
    Rol,
    Usuario,
    Integracion
  };
};