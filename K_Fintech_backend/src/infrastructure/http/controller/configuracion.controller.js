const { ParametroSistema, Rol, Usuario, Integracion } = require('../../../infrastructure/Database/dataBase.orm');
const bcrypt = require('bcryptjs');

class ConfiguracionController {
  // PARÁMETROS DEL SISTEMA
  async getParametros(req, res) {
    try {
      const parametros = await ParametroSistema.findAll({
        order: [['grupo', 'ASC'], ['clave', 'ASC']]
      });
      
      // Transformar datos para el frontend
      const parametrosTransformados = {};
      parametros.forEach(param => {
        if (!parametrosTransformados[param.grupo]) {
          parametrosTransformados[param.grupo] = {};
        }
        
        let valor = param.valor;
        if (param.tipo === 'json') {
          valor = JSON.parse(param.valor);
        } else if (param.tipo === 'number') {
          valor = Number(param.valor);
        } else if (param.tipo === 'boolean') {
          valor = param.valor === 'true';
        }
        
        parametrosTransformados[param.grupo][param.clave] = valor;
      });
      
      res.json(parametrosTransformados);
    } catch (error) {
      console.error('Error obteniendo parámetros:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async updateParametros(req, res) {
    try {
      const grupos = req.body;
      
      for (const [grupo, parametrosGrupo] of Object.entries(grupos)) {
        for (const [clave, valor] of Object.entries(parametrosGrupo)) {
          const tipo = typeof valor === 'object' ? 'json' : 
                      typeof valor === 'number' ? 'number' :
                      typeof valor === 'boolean' ? 'boolean' : 'string';
          
          const valorString = tipo === 'json' ? JSON.stringify(valor) : String(valor);
          
          await ParametroSistema.upsert({
            clave: `${grupo}_${clave}`,
            valor: valorString,
            tipo: tipo,
            descripcion: `Parámetro ${clave} del grupo ${grupo}`,
            grupo: grupo
          });
        }
      }
      
      res.json({ message: 'Parámetros actualizados correctamente' });
    } catch (error) {
      console.error('Error actualizando parámetros:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // ROLES
  async getRoles(req, res) {
    try {
      const roles = await Rol.findAll({
        order: [['nivel', 'ASC']]
      });
      res.json(roles);
    } catch (error) {
      console.error('Error obteniendo roles:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async createRol(req, res) {
    try {
      const { nombre, descripcion, nivel, permisos } = req.body;
      
      const rol = await Rol.create({
        nombre,
        descripcion,
        nivel,
        permisos
      });
      
      res.status(201).json(rol);
    } catch (error) {
      console.error('Error creando rol:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async updateRol(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, nivel, permisos } = req.body;
      
      const rol = await Rol.findByPk(id);
      if (!rol) {
        return res.status(404).json({ error: 'Rol no encontrado' });
      }
      
      await rol.update({
        nombre,
        descripcion,
        nivel,
        permisos
      });
      
      res.json(rol);
    } catch (error) {
      console.error('Error actualizando rol:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // USUARIOS
  async getUsuarios(req, res) {
    try {
      const usuarios = await Usuario.findAll({
        include: [{
          model: Rol,
          as: 'rol',
          attributes: ['id', 'nombre', 'descripcion']
        }],
        order: [['created_at', 'DESC']]
      });
      
      // Transformar datos para el frontend
      const usuariosTransformados = usuarios.map(usuario => ({
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        username: usuario.username,
        rol: usuario.rol ? usuario.rol.nombre : 'Sin rol',
        tienda: usuario.tienda_id ? `Tienda ${usuario.tienda_id}` : 'Todas',
        estado: usuario.estado,
        ultimoLogin: usuario.ultimo_login
      }));
      
      res.json(usuariosTransformados);
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async createUsuario(req, res) {
    try {
      const { nombres, apellidos, email, username, password, rol_id, tienda_id, estado } = req.body;
      
      // Encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const usuario = await Usuario.create({
        nombres,
        apellidos,
        email,
        username,
        password: hashedPassword,
        rol_id,
        tienda_id,
        estado
      });
      
      res.status(201).json({
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        username: usuario.username,
        rol: 'Rol asignado',
        tienda: tienda_id ? `Tienda ${tienda_id}` : 'Todas',
        estado: usuario.estado
      });
    } catch (error) {
      console.error('Error creando usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async updateUsuario(req, res) {
    try {
      const { id } = req.params;
      const { nombres, apellidos, email, username, rol_id, tienda_id, estado } = req.body;
      
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      await usuario.update({
        nombres,
        apellidos,
        email,
        username,
        rol_id,
        tienda_id,
        estado
      });
      
      res.json({
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        username: usuario.username,
        rol: 'Rol actualizado',
        tienda: tienda_id ? `Tienda ${tienda_id}` : 'Todas',
        estado: usuario.estado
      });
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async deleteUsuario(req, res) {
    try {
      const { id } = req.params;
      
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      await usuario.destroy();
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // INTEGRACIONES
  async getIntegraciones(req, res) {
    try {
      const integraciones = await Integracion.findAll({
        order: [['servicio', 'ASC'], ['nombre', 'ASC']]
      });
      res.json(integraciones);
    } catch (error) {
      console.error('Error obteniendo integraciones:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async createIntegracion(req, res) {
    try {
      const { servicio, nombre, configuracion } = req.body;
      
      const integracion = await Integracion.create({
        servicio,
        nombre,
        configuracion
      });
      
      res.status(201).json(integracion);
    } catch (error) {
      console.error('Error creando integración:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async updateIntegracion(req, res) {
    try {
      const { id } = req.params;
      const { servicio, nombre, configuracion, activo } = req.body;
      
      const integracion = await Integracion.findByPk(id);
      if (!integracion) {
        return res.status(404).json({ error: 'Integración no encontrada' });
      }
      
      await integracion.update({
        servicio,
        nombre,
        configuracion,
        activo
      });
      
      res.json(integracion);
    } catch (error) {
      console.error('Error actualizando integración:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new ConfiguracionController();