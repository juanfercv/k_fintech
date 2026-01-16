import type { Tienda } from '../entities/Tienda';

export interface TiendaRepository {
  getAll(): Promise<Tienda[]>;
  getById(id: number): Promise<Tienda | null>;
  getMiTienda(idDueño: number): Promise<Tienda | null>;
  create(tienda: Tienda): Promise<Tienda>;
  update(id: number, tienda: Partial<Tienda>): Promise<Tienda | null>;
  delete(id: number): Promise<boolean>;
  getByUserId(userId: number): Promise<Tienda[]>;
}
