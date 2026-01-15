const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyparser = require('body-parser');
const fileUpload = require("express-fileupload");
const multer = require('multer');
const fs = require('fs');
const mysql = require('mysql')
const myconnection = require('express-myconnection')
const cors = require('cors');
const tiendaRoutes = require('../src/infrastructure/http/router/tienda.router')

const { MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT } = require("../src/config/keys");

const app = express();
require('../src/infrastructure/lib/passport');

const options = {
    host: MYSQLHOST,
    port: MYSQLPORT,
    user: MYSQLUSER,
    password: MYSQLPASSWORD,
    database: MYSQLDATABASE,
    createDatabaseTable: true
};

app.use(myconnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'facturacion'
}))

const sessionStore = new MySQLStore(options);


const handlebars = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '../src/infrastructure/http/views/layouts'), 
    partialsDir: path.join(__dirname, '../src/infrastructure/http/views/partials'),
    extname: '.hbs',
    helpers: require('../src/infrastructure/lib/handlebars')
});

/// archivos compartidos
app.set('port', process.env.PORT || 4200);
app.set('views', path.join(__dirname, '../src/infrastructure/http/views'));
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');
/// archivos compartidos


//midlewars
app.use(fileUpload());
app.use(morgan('dev'));

app.use(bodyparser.urlencoded({
    extended: false
}));

app.use(bodyparser.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], // Frontends (user and admin)
    credentials: true
}));
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore, //agregamos esta linea
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//midlewars

//varible globales 
app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.user = req.user;
    next();
});
//varible globales 

//public
app.use(express.static(path.join(__dirname, '../src/infrastructure/http/public')));
//public 

//routers

// API routes for frontend
app.use(require('../src/infrastructure/http/router/tienda.api.router'));
app.use(require('../src/infrastructure/http/router/cliente.api.router'));
app.use(require('../src/infrastructure/http/router/auth.api.router'));
app.use(require('../src/infrastructure/http/router/forma_pago.api.router')); // Payment methods API
app.use(require('../src/infrastructure/http/router/factura.api.router')); // Invoice API
app.use(require('../src/infrastructure/http/router/configuracion.api.router')); // System Configuration API

// Optional: Keep some basic routes for API health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API is running' });
});

// For any other routes, return a simple message or redirect
app.get('*', (req, res) => {
    res.json({ 
        message: 'Welcome to the K_Fintech API', 
        endpoints: ['/api/tiendas', '/api/clientes', '/api/auth'] 
    });
});

// app.get('/factura', (req, res) => {
//     res.render('factura/factura');
// })
 app.get('/formulario', (req, res) => {
    res.render('factura/formulario');
 })
module.exports = app;