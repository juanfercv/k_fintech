import type { TiendaRepository } from '../../domain/repositories/TiendaRepository';
import type { Tienda, TiendaCreate, TiendaUpdate, TiendaFiltros } from '../../domain/entities/Tienda';

const API_BASE_URL = ''; // Using relative URLs to leverage Vite proxy

interface TiendaAPI {
  idTienda: number;
  fotoTienda?: string;
  nombreTienda: string;
  dueñoTienda: string;
  RUCTienda: string;
  dirección_matriz_tienda: string;
  direccion_sucursal_tienda?: string;
  correo_electronico_tienda: string;
  telefono: string;
  estado: 'activa' | 'inactiva';
  crearTienda?: string;
  actualizarTienda?: string;
  codigoPuntoEmision?: string;
  ciudad?: string;
  configuracionFacturacion?: string; // JSON string
}

export class TiendaRepositoryImpl implements TiendaRepository {
  async getAll(): Promise<Tienda[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tiendas`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: TiendaAPI[] = await response.json();
      
      // Transform API response to domain entity
      return data.map(item => ({
        ...item,
        configuracionFacturacion: item.configuracionFacturacion 
          ? JSON.parse(item.configuracionFacturacion) 
          : undefined
      }));
    } catch (error) {
      console.error('Error fetching tiendas:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Tienda | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tiendas/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: TiendaAPI = await response.json();
      
      return {
        ...data,
        configuracionFacturacion: data.configuracionFacturacion 
          ? JSON.parse(data.configuracionFacturacion) 
          : undefined
      };
    } catch (error) {
      console.error(`Error fetching tienda ${id}:`, error);
      throw error;
    }
  }

  async create(tienda: TiendaCreate): Promise<Tienda> {
    try {
      const tiendaToSend = {
        ...tienda,
        configuracionFacturacion: tienda.configuracionFacturacion 
          ? JSON.stringify(tienda.configuracionFacturacion)
          : undefined
      };

      const response = await fetch(`${API_BASE_URL}/api/tiendas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tiendaToSend),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: TiendaAPI = await response.json();
      return {
        ...data,
        configuracionFacturacion: data.configuracionFacturacion 
          ? JSON.parse(data.configuracionFacturacion) 
          : undefined
      };
    } catch (error) {
      console.error('Error creating tienda:', error);
      throw error;
    }
  }

  async update(id: number, tienda: TiendaUpdate): Promise<Tienda | null> {
    try {
      const tiendaToSend = {
        ...tienda,
        configuracionFacturacion: tienda.configuracionFacturacion 
          ? JSON.stringify(tienda.configuracionFacturacion)
          : undefined
      };

      const response = await fetch(`${API_BASE_URL}/api/tiendas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tiendaToSend),
      });
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: TiendaAPI = await response.json();
      return {
        ...data,
        configuracionFacturacion: data.configuracionFacturacion 
          ? JSON.parse(data.configuracionFacturacion) 
          : undefined
      };
    } catch (error) {
      console.error(`Error updating tienda ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      // Implementación de eliminación lógica - cambiar estado a inactiva
      const tienda = await this.getById(id);
      if (!tienda) return false;
      
      const response = await fetch(`${API_BASE_URL}/api/tiendas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: 'inactiva' }),
      });
      
      return response.ok;
    } catch (error) {
      console.error(`Error deleting tienda ${id}:`, error);
      return false;
    }
  }

  async getByFiltros(filtros: TiendaFiltros): Promise<Tienda[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filtros.estado) queryParams.append('estado', filtros.estado);
      if (filtros.ciudad) queryParams.append('ciudad', filtros.ciudad);
      if (filtros.nombre) queryParams.append('nombre', filtros.nombre);
      
      const queryString = queryParams.toString();
      const url = queryString 
        ? `${API_BASE_URL}/api/tiendas?${queryString}`
        : `${API_BASE_URL}/api/tiendas`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: TiendaAPI[] = await response.json();
      return data.map(item => ({
        ...item,
        configuracionFacturacion: item.configuracionFacturacion 
          ? JSON.parse(item.configuracionFacturacion) 
          : undefined
      }));
    } catch (error) {
      console.error('Error fetching tiendas with filters:', error);
      throw error;
    }
  }

  async getByEstado(estado: 'activa' | 'inactiva'): Promise<Tienda[]> {
    return this.getByFiltros({ estado });
  }

  async getByCiudad(ciudad: string): Promise<Tienda[]> {
    return this.getByFiltros({ ciudad });
  }
}