import type { TiendaRepository } from '../../domain/repositories/TiendaRepository';
import type { Tienda, TiendaCreate, TiendaUpdate } from '../../domain/entities/Tienda';

const API_BASE_URL = 'http://localhost:4200';

// Lo que devuelve backend al cliente
type TiendaAPI = Tienda;

export class TiendaRepositoryImpl implements TiendaRepository {

  private mapToDomain(data: TiendaAPI): Tienda {
    return {
      idTienda: data.idTienda,
      fotoTienda: data.fotoTienda,
      nombreTienda: data.nombreTienda,
      dueñoTienda: data.dueñoTienda,
      RUCTienda: data.RUCTienda,
      dirección_matriz_tienda: data.dirección_matriz_tienda,
      direccion_sucursal_tienda: data.direccion_sucursal_tienda,
      correo_electronico_tienda: data.correo_electronico_tienda,
      telefono: data.telefono,
      estado: data.estado,
      codigoPuntoEmision: data.codigoPuntoEmision,
      ciudad: data.ciudad,
      configuracionFacturacion: data.configuracionFacturacion
    };
  }

  async getAll(): Promise<Tienda[]> {
    const res = await fetch(`${API_BASE_URL}/api/tiendas`);
    const data: TiendaAPI[] = await res.json();
    return data.map(d => this.mapToDomain(d));
  }

  async getById(id: number): Promise<Tienda | null> {
    const res = await fetch(`${API_BASE_URL}/api/tiendas/${id}`);
    if (!res.ok) return null;
    return this.mapToDomain(await res.json());
  }

  async create(tienda: TiendaCreate): Promise<Tienda> {
    const res = await fetch(`${API_BASE_URL}/api/tiendas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tienda),
    });
    return this.mapToDomain(await res.json());
  }

  async update(id: number, tienda: TiendaUpdate): Promise<Tienda | null> {
    const res = await fetch(`${API_BASE_URL}/api/tiendas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tienda),
    });
    if (!res.ok) return null;
    return this.mapToDomain(await res.json());
  }

  async delete(id: number): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/api/tiendas/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  }

  async getByUserId(userId: number): Promise<Tienda[]> {
    const res = await fetch(`${API_BASE_URL}/api/tiendas/user/${userId}`);
    const data: TiendaAPI[] = await res.json();
    return data.map(d => this.mapToDomain(d));
  }

  async getMiTienda(idDueño: number): Promise<Tienda | null> {
    const res = await fetch(`${API_BASE_URL}/api/tiendas/mi/${idDueño}`);
    if (!res.ok) return null;
    const data: TiendaAPI = await res.json();
    return this.mapToDomain(data);
  }
}
