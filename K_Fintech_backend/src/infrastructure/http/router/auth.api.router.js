const express = require("express");
const router = express.Router();
const authController = require('../controller/auth.controller');

// API endpoints for authentication
router.post('/api/auth/register', authController.register);
router.post('/api/auth/login', authController.login);
router.post('/api/auth/logout', authController.logout);
router.get('/api/auth/me', authController.getMe);

module.exports = router;