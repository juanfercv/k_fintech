import type { TiendaRepository } from '../../domain/repositories/TiendaRepository';
import { TiendaEntity } from '../../domain/entities/Tienda';

const API_BASE_URL = 'http://localhost:4200';

interface TiendaAPI {
  id: number;
  nombre: string;
  puntoEmision: string;
  direccion: string;
  contacto: string;
  telefono: string;
  correo: string;
  ruc: string;
}

export class TiendaRepositoryImpl implements TiendaRepository {
  async getAll(): Promise<TiendaEntity[]> {
    // En una implementación real, esto se conectaría con la API
    const response = await fetch(`${API_BASE_URL}/api/tiendas`);
    const data: TiendaAPI[] = await response.json();
    
    return data.map((item: TiendaAPI) => 
      new TiendaEntity(
        item.id,
        item.nombre,
        item.puntoEmision,
        item.direccion,
        item.contacto,
        item.telefono,
        item.correo,
        item.ruc
      )
    );
  }

  async getById(id: number): Promise<TiendaEntity | null> {
    // En una implementación real, esto se conectaría con la API
    const response = await fetch(`${API_BASE_URL}/api/tiendas/${id}`);
    if (!response.ok) return null;
    
    const data: TiendaAPI = await response.json();
    return new TiendaEntity(
      data.id,
      data.nombre,
      data.puntoEmision,
      data.direccion,
      data.contacto,
      data.telefono,
      data.correo,
      data.ruc
    );
  }

  async create(tienda: TiendaEntity): Promise<TiendaEntity> {
    // En una implementación real, esto se conectaría con la API
    const response = await fetch(`${API_BASE_URL}/api/tiendas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tienda),
    });
    
    const data: TiendaAPI = await response.json();
    return new TiendaEntity(
      data.id,
      data.nombre,
      data.puntoEmision,
      data.direccion,
      data.contacto,
      data.telefono,
      data.correo,
      data.ruc
    );
  }

  async update(id: number, tienda: Partial<TiendaEntity>): Promise<TiendaEntity | null> {
    // En una implementación real, esto se conectaría con la API
    const response = await fetch(`${API_BASE_URL}/api/tiendas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tienda),
    });
    
    if (!response.ok) return null;
    
    const data: TiendaAPI = await response.json();
    return new TiendaEntity(
      data.id,
      data.nombre,
      data.puntoEmision,
      data.direccion,
      data.contacto,
      data.telefono,
      data.correo,
      data.ruc
    );
  }

  async delete(id: number): Promise<boolean> {
    // En una implementación real, esto se conectaría con la API
    const response = await fetch(`${API_BASE_URL}/api/tiendas/${id}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  }

  async getByUserId(userId: number): Promise<TiendaEntity[]> {
    // En una implementación real, esto se conectaría con la API
    const response = await fetch(`${API_BASE_URL}/api/tiendas/user/${userId}`);
    const data: TiendaAPI[] = await response.json();
    
    return data.map((item: TiendaAPI) => 
      new TiendaEntity(
        item.id,
        item.nombre,
        item.puntoEmision,
        item.direccion,
        item.contacto,
        item.telefono,
        item.correo,
        item.ruc
      )
    );
  }
}