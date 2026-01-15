const db = require('../src/infrastructure/Database/dataBase.orm');
const { ParametroSistema, Rol, Usuario, Integracion } = db;
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');

// Crear instancia de sequelize para el script
const sequelize = new Sequelize('facturacion', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

async function seedConfiguracion() {
  try {
    console.log('🚀 Iniciando inicialización de configuración del sistema...');
    
    // Sincronizar modelos
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');

    // Crear parámetros del sistema iniciales
    const parametrosIniciales = [
      // Parámetros de moneda
      { clave: 'moneda_codigo', valor: 'USD', tipo: 'string', descripcion: 'Código de moneda', grupo: 'moneda' },
      { clave: 'moneda_simbolo', valor: '$', tipo: 'string', descripcion: 'Símbolo de moneda', grupo: 'moneda' },
      { clave: 'moneda_nombre', valor: 'Dólar Estadounidense', tipo: 'string', descripcion: 'Nombre de moneda', grupo: 'moneda' },
      { clave: 'moneda_decimales', valor: '2', tipo: 'number', descripcion: 'Decimales de moneda', grupo: 'moneda' },
      
      // Parámetros de país
      { clave: 'pais_codigo', valor: 'EC', tipo: 'string', descripcion: 'Código de país', grupo: 'pais' },
      { clave: 'pais_nombre', valor: 'Ecuador', tipo: 'string', descripcion: 'Nombre de país', grupo: 'pais' },
      { clave: 'pais_telefono', valor: '+593', tipo: 'string', descripcion: 'Código telefónico', grupo: 'pais' },
      
      // Parámetros de impuestos
      { clave: 'impuestos_iva_porcentaje', valor: '12', tipo: 'number', descripcion: 'Porcentaje de IVA', grupo: 'impuestos' },
      { clave: 'impuestos_iva_activo', valor: 'true', tipo: 'boolean', descripcion: 'IVA activo', grupo: 'impuestos' },
      { clave: 'impuestos_ice_porcentaje', valor: '0', tipo: 'number', descripcion: 'Porcentaje de ICE', grupo: 'impuestos' },
      { clave: 'impuestos_ice_activo', valor: 'false', tipo: 'boolean', descripcion: 'ICE activo', grupo: 'impuestos' },
      { clave: 'impuestos_retencion_porcentaje', valor: '1', tipo: 'number', descripcion: 'Porcentaje de retención', grupo: 'impuestos' },
      { clave: 'impuestos_retencion_activo', valor: 'true', tipo: 'boolean', descripcion: 'Retención activa', grupo: 'impuestos' },
      
      // Parámetros de documentos
      { clave: 'documentos_prefijo', valor: 'FAC', tipo: 'string', descripcion: 'Prefijo de facturas', grupo: 'documentos' },
      { clave: 'documentos_longitud', valor: '8', tipo: 'number', descripcion: 'Longitud de secuencia', grupo: 'documentos' },
      { clave: 'documentos_incluir_anio', valor: 'true', tipo: 'boolean', descripcion: 'Incluir año en numeración', grupo: 'documentos' },
      { clave: 'documentos_incluir_mes', valor: 'true', tipo: 'boolean', descripcion: 'Incluir mes en numeración', grupo: 'documentos' },
      { clave: 'documentos_separador', valor: '-', tipo: 'string', descripcion: 'Separador en numeración', grupo: 'documentos' }
    ];

    for (const param of parametrosIniciales) {
      await ParametroSistema.findOrCreate({
        where: { clave: param.clave },
        defaults: param
      });
    }
    console.log('✅ Parámetros del sistema creados');

    // Crear roles iniciales
    const rolesIniciales = [
      {
        nombre: 'Administrador General',
        descripcion: 'Acceso completo al sistema',
        nivel: 1,
        permisos: {
          tiendas: ['leer', 'crear', 'editar', 'eliminar'],
          facturas: ['leer', 'crear', 'editar', 'anular', 'reportes'],
          clientes: ['leer', 'crear', 'editar', 'eliminar'],
          metodosPago: ['leer', 'crear', 'editar', 'eliminar'],
          configuracion: ['leer', 'editar', 'eliminar']
        }
      },
      {
        nombre: 'Administrador de Tienda',
        descripcion: 'Gestión de una tienda específica',
        nivel: 2,
        permisos: {
          tiendas: ['leer'],
          facturas: ['leer', 'crear', 'editar', 'anular'],
          clientes: ['leer', 'crear', 'editar'],
          metodosPago: ['leer']
        }
      },
      {
        nombre: 'Cajero',
        descripcion: 'Operaciones básicas de facturación',
        nivel: 3,
        permisos: {
          tiendas: ['leer'],
          facturas: ['leer', 'crear'],
          clientes: ['leer', 'crear'],
          metodosPago: ['leer']
        }
      }
    ];

    for (const rol of rolesIniciales) {
      await Rol.findOrCreate({
        where: { nombre: rol.nombre },
        defaults: rol
      });
    }
    console.log('✅ Roles del sistema creados');

    // Crear usuario administrador por defecto
    const adminExists = await Usuario.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const adminRol = await Rol.findOne({ where: { nombre: 'Administrador General' } });
      
      await Usuario.create({
        nombres: 'Administrador',
        apellidos: 'del Sistema',
        email: 'admin@sistema.com',
        username: 'admin',
        password: hashedPassword,
        rol_id: adminRol.id,
        estado: 'activo'
      });
      console.log('✅ Usuario administrador creado (usuario: admin, contraseña: admin123)');
    }

    // Crear integraciones iniciales
    const integracionesIniciales = [
      {
        servicio: 'sri',
        nombre: 'Servicio de Rentas Internas - Ambiente Pruebas',
        configuracion: {
          ambiente: 'pruebas',
          claveAcceso: 'CLAVE_DE_PRUEBAS_SRI',
          urlRecepcion: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
          urlAutorizacion: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
          activo: true
        }
      },
      {
        servicio: 'correo',
        nombre: 'Configuración SMTP para Envío de Facturas',
        configuracion: {
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpUser: 'facturacion@empresa.com',
          smtpPass: 'contraseña_segura',
          remitente: 'Facturación Empresa',
          activo: false
        }
      }
    ];

    for (const integracion of integracionesIniciales) {
      await Integracion.findOrCreate({
        where: { nombre: integracion.nombre },
        defaults: integracion
      });
    }
    console.log('✅ Integraciones iniciales creadas');

    console.log('🎉 Inicialización de configuración completada exitosamente!');
    console.log('\n📝 Credenciales por defecto:');
    console.log('   Usuario: admin');
    console.log('   Contraseña: admin123');
    
  } catch (error) {
    console.error('❌ Error en la inicialización:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedConfiguracion();
}

module.exports = seedConfiguracion;