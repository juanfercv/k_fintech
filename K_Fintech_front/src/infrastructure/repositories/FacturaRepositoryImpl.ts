import type { FacturaRepository } from '../../domain/repositories/FacturaRepository';
import type { Factura } from '../../domain/entities/Factura';
import api from '../../services/api';

// Define backend factura response type
interface BackendFactura {
  idFactura?: number;
  id?: number;
  fecha_emision: string;
  idTienda?: number;
  tiendaId?: number;
  idCliente?: number;
  clienteId?: number;
  idFormaPago?: number;
  metodoPagoId?: number;
  estado_factura?: string;
  estado?: string;
  detalle?: string;
  total?: number;
  detalle_total?: {
    valor_total?: string;
  };
}

export class FacturaRepositoryImpl implements FacturaRepository {
  async getAll(): Promise<Factura[]> {
    try {
      const response: BackendFactura[] = await api.facturaService.getAll();
      // Transform backend response to match frontend entity structure
      return response.map((factura: BackendFactura) => ({
        id: factura.idFactura || factura.id || 0,
        fecha_emision: factura.fecha_emision,
        tiendaId: factura.idTienda || factura.tiendaId || 0,
        clienteId: factura.idCliente || factura.clienteId || 0,
        metodoPagoId: factura.idFormaPago || factura.metodoPagoId || 0,
        total: parseFloat(factura.total?.toString() || '0'),
        estado: factura.estado_factura || factura.estado || 'Pendiente',
        detalle: factura.detalle || ''
      }));
    } catch (error) {
      console.error('Error fetching facturas:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Factura | null> {
    try {
      const factura: BackendFactura = await api.facturaService.getById(id);
      if (!factura) return null;
      
      return {
        id: factura.idFactura || factura.id || 0,
        fecha_emision: factura.fecha_emision,
        tiendaId: factura.idTienda || factura.tiendaId || 0,
        clienteId: factura.idCliente || factura.clienteId || 0,
        metodoPagoId: factura.idFormaPago || factura.metodoPagoId || 0,
        total: parseFloat(factura.total?.toString() || '0'),
        estado: factura.estado_factura || factura.estado || 'Pendiente',
        detalle: factura.detalle || ''
      };
    } catch (error) {
      console.error('Error fetching factura:', error);
      throw error;
    }
  }

  async create(facturaData: Omit<Factura, 'id'>): Promise<Factura> {
    try {
      // Transform frontend entity to match backend expected format
      const backendData = {
        idTienda: facturaData.tiendaId,
        idCliente: facturaData.clienteId,
        idFormaPago: facturaData.metodoPagoId,
        fecha_emision: facturaData.fecha_emision,
        estado_factura: facturaData.estado,
        detalle: facturaData.detalle
      };
      
      const createdFactura: BackendFactura = await api.facturaService.create(backendData);
      
      return {
        id: createdFactura.idFactura || createdFactura.id || 0,
        fecha_emision: createdFactura.fecha_emision,
        tiendaId: createdFactura.idTienda || createdFactura.tiendaId || 0,
        clienteId: createdFactura.idCliente || createdFactura.clienteId || 0,
        metodoPagoId: createdFactura.idFormaPago || createdFactura.metodoPagoId || 0,
        total: parseFloat(createdFactura.total?.toString() || '0'),
        estado: createdFactura.estado_factura || createdFactura.estado || 'Pendiente',
        detalle: createdFactura.detalle || ''
      };
    } catch (error) {
      console.error('Error creating factura:', error);
      throw error;
    }
  }

  async update(id: number, facturaData: Partial<Omit<Factura, 'id'>>): Promise<Factura | null> {
    try {
      // Transform frontend entity to match backend expected format
      const backendData = {
        idTienda: facturaData.tiendaId,
        idCliente: facturaData.clienteId,
        idFormaPago: facturaData.metodoPagoId,
        fecha_emision: facturaData.fecha_emision,
        estado_factura: facturaData.estado,
        detalle: facturaData.detalle
      };
      
      const updatedFactura: BackendFactura = await api.facturaService.update(id, backendData);
      
      if (!updatedFactura) return null;
      
      return {
        id: updatedFactura.idFactura || updatedFactura.id || 0,
        fecha_emision: updatedFactura.fecha_emision,
        tiendaId: updatedFactura.idTienda || updatedFactura.tiendaId || 0,
        clienteId: updatedFactura.idCliente || updatedFactura.clienteId || 0,
        metodoPagoId: updatedFactura.idFormaPago || updatedFactura.metodoPagoId || 0,
        total: parseFloat(updatedFactura.total?.toString() || '0'),
        estado: updatedFactura.estado_factura || updatedFactura.estado || 'Pendiente',
        detalle: updatedFactura.detalle || ''
      };
    } catch (error) {
      console.error('Error updating factura:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await api.facturaService.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting factura:', error);
      return false;
    }
  }
}