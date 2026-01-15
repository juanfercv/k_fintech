const mysql = require('mysql2');

// Get database configuration
const { MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT } = require('../src/config/keys');

console.log('Intentando conectar a MySQL...');
console.log('Host:', MYSQLHOST);
console.log('User:', MYSQLUSER);
console.log('Database:', MYSQLDATABASE);

// Create connection without specifying database
const connection = mysql.createConnection({
    host: MYSQLHOST,
    user: MYSQLUSER,
    password: MYSQLPASSWORD,
    port: MYSQLPORT
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        process.exit(1);
    }
    
    console.log('Conexión exitosa a MySQL');
    
    // Create database
    connection.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQLDATABASE}\``, (err, results) => {
        if (err) {
            console.error('Error creando base de datos:', err);
            connection.end();
            process.exit(1);
        }
        
        console.log(`Base de datos '${MYSQLDATABASE}' creada o ya existente`);
        
        // Select the database
        connection.query(`USE \`${MYSQLDATABASE}\``, (err, results) => {
            if (err) {
                console.error('Error seleccionando base de datos:', err);
                connection.end();
                process.exit(1);
            }
            
            console.log(`Usando base de datos '${MYSQLDATABASE}'`);
            
            // Create tables if they don't exist
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS forma_pagos (
                    id_forma_pago INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL,
                    descripcion TEXT,
                    activo BOOLEAN DEFAULT TRUE,
                    crearFormaPago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    actualizarFormaPago TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `;
            
            connection.query(createTableQuery, (err, results) => {
                if (err) {
                    console.error('Error creando tabla:', err);
                    connection.end();
                    process.exit(1);
                }
                
                console.log('Tabla forma_pagos creada o ya existente');
                console.log('¡Configuración de base de datos completada exitosamente!');
                connection.end();
                process.exit(0);
            });
        });
    });
});