const mysql = require('mysql2');

// Get database configuration
const { MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT } = require('../src/config/keys');

// Create a connection to the database
const connection = mysql.createConnection({
    host: MYSQLHOST,
    user: MYSQLUSER,
    password: MYSQLPASSWORD,
    database: MYSQLDATABASE,
    port: MYSQLPORT
});

// Sample payment methods data
const formasPago = [
    {
        nombre: 'Efectivo',
        descripcion: 'Pago en efectivo',
        activo: true
    },
    {
        nombre: 'Tarjeta de Débito',
        descripcion: 'Pago con tarjeta de débito',
        activo: true
    },
    {
        nombre: 'Tarjeta de Crédito',
        descripcion: 'Pago con tarjeta de crédito',
        activo: true
    },
    {
        nombre: 'Transferencia Bancaria',
        descripcion: 'Transferencia bancaria',
        activo: true
    },
    {
        nombre: 'PayPal',
        descripcion: 'Pago mediante PayPal',
        activo: false // Inactivo por defecto
    }
];

// Insert sample data
const seedDatabase = async () => {
    try {
        console.log('Conectando a la base de datos...');
        
        // First, clear existing data
        await new Promise((resolve, reject) => {
            connection.query('DELETE FROM forma_pagos', (err, results) => {
                if (err) {
                    console.error('Error clearing table:', err);
                    reject(err);
                } else {
                    console.log('Tabla forma_pagos limpiada');
                    resolve(results);
                }
            });
        });

        // Insert sample payment methods
        for (const formaPago of formasPago) {
            await new Promise((resolve, reject) => {
                connection.query(
                    'INSERT INTO forma_pagos (nombre, descripcion, activo, crearFormaPago, actualizarFormaPago) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
                    [formaPago.nombre, formaPago.descripcion, formaPago.activo],
                    (err, results) => {
                        if (err) {
                            console.error('Error inserting payment method:', err);
                            reject(err);
                        } else {
                            console.log(`Método de pago "${formaPago.nombre}" insertado con ID: ${results.insertId}`);
                            resolve(results);
                        }
                    }
                );
            });
        }

        console.log('¡Datos de prueba insertados exitosamente!');
        connection.end();
        
    } catch (error) {
        console.error('Error seeding database:', error);
        connection.end();
    }
};

seedDatabase();