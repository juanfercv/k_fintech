import type { FacturaRepository } from '../../domain/repositories/FacturaRepository';
import type { Factura, FacturaCreate, FacturaUpdate } from '../../domain/entities/Factura';

const API_BASE_URL = ''; // Using relative URLs to leverage Vite proxy

interface FacturaAPI {
  idFactura: number;
  fecha_emision: string;
  idTienda: number;
  idCliente: number;
  idFormaPago: number;
  estado_factura: string;
  detalle: string;
  total: number;
  crearFactura?: string;
  actualizarFactura?: string;
}

export class FacturaRepositoryImpl implements FacturaRepository {
  async getAll(): Promise<Factura[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/facturas`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: FacturaAPI[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching facturas:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Factura | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/facturas/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: FacturaAPI = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching factura ${id}:`, error);
      throw error;
    }
  }

  async create(factura: FacturaCreate): Promise<Factura> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/facturas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(factura),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: FacturaAPI = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating factura:', error);
      throw error;
    }
  }

  async update(id: number, factura: FacturaUpdate): Promise<Factura | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/facturas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(factura),
      });
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: FacturaAPI = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating factura ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/facturas/${id}`, {
        method: 'DELETE',
      });
      
      return response.ok;
    } catch (error) {
      console.error(`Error deleting factura ${id}:`, error);
      return false;
    }
  }

  async getByTienda(tiendaId: number): Promise<Factura[]> {
    try {
      // Assuming the backend supports filtering by tienda
      const response = await fetch(`${API_BASE_URL}/api/facturas?tiendaId=${tiendaId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: FacturaAPI[] = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching facturas for tienda ${tiendaId}:`, error);
      throw error;
    }
  }

  async getByCliente(clienteId: number): Promise<Factura[]> {
    try {
      // Assuming the backend supports filtering by cliente
      const response = await fetch(`${API_BASE_URL}/api/facturas?clienteId=${clienteId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: FacturaAPI[] = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching facturas for cliente ${clienteId}:`, error);
      throw error;
    }
  }

  async getByEstado(estado: string): Promise<Factura[]> {
    try {
      // Assuming the backend supports filtering by estado
      const response = await fetch(`${API_BASE_URL}/api/facturas?estado=${encodeURIComponent(estado)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: FacturaAPI[] = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching facturas with estado ${estado}:`, error);
      throw error;
    }
  }
}