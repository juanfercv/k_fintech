import type { Tienda, TiendaCreate, TiendaUpdate, TiendaFiltros } from '../entities/Tienda';

export interface TiendaRepository {
  getAll(): Promise<Tienda[]>;
  getById(id: number): Promise<Tienda | null>;
  create(tienda: TiendaCreate): Promise<Tienda>;
  update(id: number, tienda: TiendaUpdate): Promise<Tienda | null>;
  delete(id: number): Promise<boolean>;
  getByFiltros(filtros: TiendaFiltros): Promise<Tienda[]>;
  getByEstado(estado: 'activa' | 'inactiva'): Promise<Tienda[]>;
  getByCiudad(ciudad: string): Promise<Tienda[]>;
}