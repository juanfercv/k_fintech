const {createPool} = require ("mysql2")
const {promisify} = require ("util")
const dotenv = require('dotenv');

// const { database } = require('../keys')


dotenv.config();

const{ MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT, MYSQL_URI, } = require ("../../config/keys");

const pool = createPool ({
    user: MYSQLUSER,
    password: MYSQLPASSWORD,
    host: MYSQLHOST,
    port: MYSQLPORT,
    database: MYSQLDATABASE,
    uri: MYSQL_URI
})

pool.getConnection((err, conecction)=>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('se cerro la conexión a la base de datos');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('La base de datos tiene muchas conexiones')
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('La conexion a la base de datos no realizada')
        }
    }
    if(conecction){
        conecction.release();
        console.log('Base de datos Conectada');
        return
    }
})

pool.query = promisify(pool.query);
module.exports = pool;