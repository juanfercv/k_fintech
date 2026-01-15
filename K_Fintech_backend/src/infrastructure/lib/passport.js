const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// const path = require("path");
// const CryptoJS = require("crypto-js");
const orm = require("../Database/dataBase.orm")
// const request = require('request');
// const fs = require('fs');

const helpers = require("./helpers");

//INICIO DE SESION
passport.use(
	"local.signin",
	new LocalStrategy(
		{
			usernameField: "correo_electronico_Dueño",
			passwordField: "password_Dueño",
			passReqToCallback: true,
		},
		async (req, correo_electronico_Dueño, password_Dueño, done) => {
			const rows = await orm.dueño.findOne({ where: { correo_electronico_Dueño: correo_electronico_Dueño } });
			if (rows) {
				const user = rows;
				const validPassword = await helpers.matchPassword(
					password_Dueño,
					user.password_Dueño
				)
				if (validPassword) {
					done(
						null,
						user,
						req.flash(
							"message",
							"Bienvenido" + " " + user.correo_electronico_Dueño
						)
					);
				} else {
					done(null, false, req.flash("message", "Datos incorrectos"));
				}
			} else {
				return done(
					null,
					false,
					req.flash("message", "El nombre de usuario no existe.")
				);
			}
		}
	)
);
// REGISTRO
passport.use(
    "local.signup",
    new LocalStrategy(
        {
            usernameField: "correo_electronico_Dueño",
            passwordField: "password_Dueño",
            passReqToCallback: true,
        },
        async (req, correo_electronico_Dueño, password_Dueño, done) => {
            
            // 1. Buscamos si el correo ya existe
            const usuarioExistente = await orm.dueño.findOne({ 
                where: { correo_electronico_Dueño: correo_electronico_Dueño }
            });

            // 2. Si existe (NO es null), devolvemos error inmediatamente
            if (usuarioExistente) {
                return done(
                    null, 
                    false, 
                    req.flash("message", "El correo electrónico ya está registrado.")
                );
            } 
            
            // 3. Si NO existe, procedemos a crear el usuario
            else {
                const { nombres_Dueño, apellidos_Dueño, cedula_Dueño, celular_Dueño } = req.body;
                
                let nuevoDueño = {
                    nombres_Dueño,
                    apellidos_Dueño,
                    cedula_Dueño,
                    celular_Dueño,
                    correo_electronico_Dueño,
                    password_Dueño
                };

                // Encriptar contraseña
                nuevoDueño.password_Dueño = await helpers.encryptPassword(password_Dueño);
                
                // Guardar en Base de Datos
                const resultado = await orm.dueño.create(nuevoDueño);
                
                // Asignar ID para la sesión
                nuevoDueño.id = resultado.insertId; // Asegúrate de que tu ORM devuelva insertId, si es Sequelize suele devolver el objeto completo.
                
                // Si usas Sequelize puro, 'resultado' ya es el objeto usuario con ID, podrías usar:
                // return done(null, resultado);

                return done(null, nuevoDueño);
            }
        }
    )
);

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});
