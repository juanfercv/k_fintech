const express = require('express');
const {Mostrar} = require('../controller/vista.controller');
const router = express.Router();

router.get('/', Mostrar)

module.exports = router 