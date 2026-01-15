const MYSQLHOST = process.env.MYSQLHOST || 'localhost'
const MYSQLUSER = process.env.MYSQLUSER || 'root'
const MYSQLPASSWORD = process.env.MYSQLPASSWORD || ''
const MYSQLDATABASE = process.env.MYSQLDATABASE || 'facturacion'
const MYSQLPORT = process.env.MYSQLPORT || 3306
const MYSQL_URI = process.env.MYSQL_URI || ''


module.exports = {
    MYSQLHOST,
    MYSQLUSER,
    MYSQLPASSWORD,
    MYSQLDATABASE,
    MYSQLPORT,
    MYSQL_URI
}

