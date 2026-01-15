const authController = {};

// Desde carpeta 'root'
const orm = require('../../Database/dataBase.orm');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// API methods for authentication
authController.register = async (req, res) => {
    try {
        const { nombres_Dueño, apellidos_Dueño, cedula_Dueño, celular_Dueño, correo_electronico_Dueño, password_Dueño } = req.body;
        
        // Verificar si el usuario ya existe
        const existingUser = await orm.dueño.findOne({ 
            where: { 
                correo_electronico_Dueño: correo_electronico_Dueño 
            } 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: 'El usuario ya existe con este correo electrónico' 
            });
        }
        
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password_Dueño, 8);
        
        // Crear nuevo usuario
        const nuevoUsuario = await orm.dueño.create({
            nombres_Dueño,
            apellidos_Dueño,
            cedula_Dueño,
            celular_Dueño,
            correo_electronico_Dueño,
            password_Dueño: hashedPassword
        });
        
        // Remover la contraseña del objeto antes de enviarla
        const { password_Dueño: _, ...usuarioSinPassword } = nuevoUsuario.toJSON();
        
        res.status(201).json(usuarioSinPassword);
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ 
            message: 'Error al registrar el usuario',
            error: error.message 
        });
    }
};

authController.login = async (req, res, next) => {
    try {
        passport.authenticate('local.signin', (err, user, info) => {
            if (err) {
                return res.status(500).json({ 
                    message: 'Error de autenticación',
                    error: err 
                });
            }
            
            if (!user) {
                return res.status(401).json({ 
                    message: info.message || 'Credenciales inválidas' 
                });
            }
            
            req.logIn(user, (err) => {
                if (err) {
                    return res.status(500).json({ 
                        message: 'Error al iniciar sesión',
                        error: err 
                    });
                }
                
                // Remover la contraseña del objeto antes de enviarla
                const { password_Dueño: _, ...usuarioSinPassword } = user.toJSON();
                
                return res.status(200).json(usuarioSinPassword);
            });
        })(req, res, next);
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            message: 'Error al iniciar sesión',
            error: error.message 
        });
    }
};

authController.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ 
                message: 'Error al cerrar sesión',
                error: err 
            });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ 
                    message: 'Error al cerrar sesión',
                    error: err 
                });
            }
            res.clearCookie('connect.sid'); // Nombre por defecto de la cookie de sesión
            res.json({ message: 'Sesión cerrada exitosamente' });
        });
    });
};

authController.getMe = (req, res) => {
    if (req.isAuthenticated()) {
        // Remover la contraseña del objeto antes de enviarla
        const { password_Dueño: _, ...usuarioSinPassword } = req.user.toJSON();
        res.json(usuarioSinPassword);
    } else {
        res.status(401).json({ message: 'No autenticado' });
    }
};

module.exports = authController;