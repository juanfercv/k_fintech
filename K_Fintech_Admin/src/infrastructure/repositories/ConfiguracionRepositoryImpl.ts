import type { ParametrosGenerales, Usuario, Rol, Integracion } from '../../domain/entities/Configuracion';

const API_BASE_URL = ''; // Usando URLs relativas para aprovechar el proxy de Vite

export class ConfiguracionRepositoryImpl {
  // PARÁMETROS DEL SISTEMA
  async getParametros(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/configuracion/parametros`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching parametros:', error);
      throw error;
    }
  }

  async updateParametros(parametros: any): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/configuracion/parametros`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parametros),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating parametros:', error);
      throw error;
    }
  }

  // ROLES
  async getRoles(): Promise<Rol[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/configuracion/roles`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  async createRol(rol: any): Promise<Rol> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/configuracion/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rol),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating rol:', error);
      throw error;
    }
  }

  async updateRol(id: number, rol: any): Promise<Rol> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/configuracion/roles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rol),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating rol:', error);
      throw error;
    }
  }

  // USUARIOS
  async getUsuarios(): Promise<Usuario[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/configuracion/usuarios`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      throw error;
    }
  }

  async createUsuario(usuario: any): Promise<Usuario> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/configuracion/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating usuario:', error);
      throw error;
    }
  }

  async updateUsuario(id: number, usuario: any): Promise<Usuario> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/configuracion/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating usuario:', error);
      throw error;
    }
  }

  async deleteUsuario(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/configuracion/usuarios/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting usuario:', error);
      throw error;
    }
  }

  // INTEGRACIONES
  async getIntegraciones(): Promise<Integracion[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/configuracion/integraciones`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching integraciones:', error);
      throw error;
    }
  }

  async createIntegracion(integracion: any): Promise<Integracion> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/configuracion/integraciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(integracion),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating integracion:', error);
      throw error;
    }
  }

  async updateIntegracion(id: number, integracion: any): Promise<Integracion> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/configuracion/integraciones/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(integracion),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating integracion:', error);
      throw error;
    }
  }
}