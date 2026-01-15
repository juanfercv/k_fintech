import type { MetodoPagoRepository } from '../../domain/repositories/MetodoPagoRepository';
import { MetodoPagoEntity } from '../../domain/entities/MetodoPago';

const API_BASE_URL = ''; // Using relative URLs to leverage Vite proxy

// Alias para mantener consistencia entre nombre en frontend y backend
const METODOS_ENDPOINT = '/api/formas_pago';

interface MetodoPagoAPI {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export class MetodoPagoRepositoryImpl implements MetodoPagoRepository {
  async getAll(): Promise<MetodoPagoEntity[]> {
    const response = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}`);
    const data: MetodoPagoAPI[] = await response.json();
    
    return data.map((item: MetodoPagoAPI) => 
      new MetodoPagoEntity(
        item.id,
        item.nombre,
        '', // codigoInterno - not provided by API
        '', // codigoSRI - not provided by API
        item.descripcion,
        item.activo,
        false, // permitePagoDiferido - default
        1, // maximoCuotas - default
        false, // integracionPasarela - default
        new Date(), // fechaCreacion - default
        new Date() // fechaModificacion - default
      )
    );
  }

  async getById(id: number): Promise<MetodoPagoEntity | null> {
    const response = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}/${id}`);
    if (!response.ok) return null;
    
    const data: MetodoPagoAPI = await response.json();
    return new MetodoPagoEntity(
      data.id,
      data.nombre,
      '', // codigoInterno - not provided by API
      '', // codigoSRI - not provided by API
      data.descripcion,
      data.activo,
      false, // permitePagoDiferido - default
      1, // maximoCuotas - default
      false, // integracionPasarela - default
      new Date(), // fechaCreacion - default
      new Date() // fechaModificacion - default
    );
  }

  async create(metodo: MetodoPagoEntity): Promise<MetodoPagoEntity> {
    const response = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metodo),
    });
    
    const data: MetodoPagoAPI = await response.json();
    return new MetodoPagoEntity(
      data.id,
      data.nombre,
      '', // codigoInterno - not provided by API
      '', // codigoSRI - not provided by API
      data.descripcion,
      data.activo,
      false, // permitePagoDiferido - default
      1, // maximoCuotas - default
      false, // integracionPasarela - default
      new Date(), // fechaCreacion - default
      new Date() // fechaModificacion - default
    );
  }

  async update(id: number, metodo: Partial<MetodoPagoEntity>): Promise<MetodoPagoEntity | null> {
    const response = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metodo),
    });
    
    if (!response.ok) return null;
    
    const data: MetodoPagoAPI = await response.json();
    return new MetodoPagoEntity(
      data.id,
      data.nombre,
      '', // codigoInterno - not provided by API
      '', // codigoSRI - not provided by API
      data.descripcion,
      data.activo,
      false, // permitePagoDiferido - default
      1, // maximoCuotas - default
      false, // integracionPasarela - default
      new Date(), // fechaCreacion - default
      new Date() // fechaModificacion - default
    );
  }

  async delete(id: number): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  }

  async getActive(): Promise<MetodoPagoEntity[]> {
    const response = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}/activas`);
    const data: MetodoPagoAPI[] = await response.json();
    
    return data.map((item: MetodoPagoAPI) => 
      new MetodoPagoEntity(
        item.id,
        item.nombre,
        '', // codigoInterno - not provided by API
        '', // codigoSRI - not provided by API
        item.descripcion,
        item.activo,
        false, // permitePagoDiferido - default
        1, // maximoCuotas - default
        false, // integracionPasarela - default
        new Date(), // fechaCreacion - default
        new Date() // fechaModificacion - default
      )
    );
  }
}