import type { MetodoPagoAdminRepository } from '../../domain/repositories/MetodoPagoAdminRepository';
import type { MetodoPagoAdmin } from '../../domain/entities/MetodoPagoAdmin';

const API_BASE_URL = '';
const METODOS_ENDPOINT = '/api/formas_pago';

export class MetodoPagoAdminRepositoryImpl implements MetodoPagoAdminRepository {
  private async mapApiToAdmin(apiItem: any): Promise<MetodoPagoAdmin> {
    return {
      id: apiItem.id || apiItem.id_forma_pago,
      nombre: apiItem.nombre || '',
      descripcion: apiItem.descripcion || '',
      codigoInterno: apiItem.codigoInterno || '',
      codigoSRI: apiItem.codigoSRI || '',
      activo: typeof apiItem.activo === 'boolean' ? apiItem.activo : true,
      permitePagoDiferido: apiItem.permitePagoDiferido || false,
      maximoCuotas: apiItem.maximoCuotas || 1,
      integracionPasarela: apiItem.integracionPasarela || false,
      fechaCreacion: apiItem.crearFormaPago ? new Date(apiItem.crearFormaPago) : new Date(),
      fechaModificacion: apiItem.actualizarFormaPago ? new Date(apiItem.actualizarFormaPago) : new Date(),
      habilitadoPorTienda: apiItem.habilitadoPorTienda || true,
      configuracionTiendas: apiItem.configuracionTiendas || []
    };
  }

  async getAll(): Promise<MetodoPagoAdmin[]> {
    const res = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}`);
    const data = await res.json();
    const mapped = await Promise.all(data.map((d: any) => this.mapApiToAdmin(d)));
    return mapped;
  }

  async getById(id: number): Promise<MetodoPagoAdmin | null> {
    const res = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return this.mapApiToAdmin(data);
  }

  async create(metodoPagoData: Omit<MetodoPagoAdmin, 'id'>): Promise<MetodoPagoAdmin> {
    const res = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metodoPagoData)
    });
    const data = await res.json();
    return this.mapApiToAdmin(data);
  }

  async update(id: number, metodoPagoData: Partial<Omit<MetodoPagoAdmin, 'id'>>): Promise<MetodoPagoAdmin | null> {
    const res = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metodoPagoData)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return this.mapApiToAdmin(data);
  }

  async delete(id: number): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  }
}