const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'facturacion'
});

console.log('🔄 Verificando y preparando datos iniciales...\n');

connection.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión:', err);
    process.exit(1);
  }

  // Verificar si hay datos mínimos
  connection.query('SELECT COUNT(*) as count FROM tiendas', (err, results) => {
    const tiendasCount = results[0].count;
    
    connection.query('SELECT COUNT(*) as count FROM clientes', (err, results) => {
      const clientesCount = results[0].count;
      
      connection.query('SELECT COUNT(*) as count FROM forma_pagos', (err, results) => {
        const formasPagoCount = results[0].count;
        
        let needsSetup = false;
        
        if (tiendasCount === 0) {
          console.log('🏪 No hay tiendas, creando datos iniciales...');
          needsSetup = true;
        }
        
        if (clientesCount === 0) {
          console.log('👤 No hay clientes, creando datos iniciales...');
          needsSetup = true;
        }
        
        if (formasPagoCount === 0) {
          console.log('💳 No hay formas de pago, creando datos iniciales...');
          needsSetup = true;
        }
        
        if (needsSetup) {
          setupInitialData();
        } else {
          console.log('✅ Todos los datos mínimos están presentes');
          connection.end();
        }
      });
    });
  });
});

function setupInitialData() {
  console.log('\n📋 Creando datos iniciales...\n');
  
  // Insertar tienda
  const insertTienda = `INSERT IGNORE INTO tiendas (idTienda, nombreTienda, RUCTienda, dirección_matriz_tienda, correo_electronico_tienda, telefono) VALUES (?, ?, ?, ?, ?, ?)`;
  const tiendaData = [1, 'Tienda de Prueba', '1234567890001', 'Dirección de prueba', 'tienda@prueba.com', '0999999999'];
  
  connection.query(insertTienda, tiendaData, (err, result) => {
    if (err) {
      console.error('❌ Error insertando tienda:', err.message);
    } else {
      console.log('✅ Tienda creada/verificada');
    }
    
    // Insertar cliente
    const insertCliente = `INSERT IGNORE INTO clientes (id_cliente, nombre_cliente, cedula_cliente, direccion_cliente, correo_cliente, celular_cliente) VALUES (?, ?, ?, ?, ?, ?)`;
    const clienteData = [1, 'Cliente de Prueba', '1234567890', 'Dirección cliente', 'cliente@prueba.com', '0988888888'];
    
    connection.query(insertCliente, clienteData, (err, result) => {
      if (err) {
        console.error('❌ Error insertando cliente:', err.message);
      } else {
        console.log('✅ Cliente creado/verificado');
      }
      
      // Insertar formas de pago
      const formasPago = [
        [1, 'Efectivo', 'Pago en efectivo', 1],
        [2, 'Tarjeta de Débito', 'Pago con tarjeta débito', 1],
        [3, 'Tarjeta de Crédito', 'Pago con tarjeta crédito', 1],
        [4, 'Transferencia Bancaria', 'Transferencia bancaria', 1],
        [5, 'PayPal', 'Pago digital PayPal', 0]
      ];
      
      let formasInserted = 0;
      formasPago.forEach((forma, index) => {
        const insertForma = `INSERT IGNORE INTO forma_pagos (id_forma_pago, nombre, descripcion, activo) VALUES (?, ?, ?, ?)`;
        connection.query(insertForma, forma, (err, result) => {
          formasInserted++;
          if (err) {
            console.error(`❌ Error insertando forma de pago ${forma[1]}:`, err.message);
          } else {
            console.log(`✅ Forma de pago "${forma[1]}" creada/verificada`);
          }
          
          if (formasInserted === formasPago.length) {
            console.log('\n🎉 ¡Todos los datos iniciales están listos!');
            console.log('Puedes comenzar a crear facturas desde el frontend.');
            connection.end();
          }
        });
      });
    });
  });
}