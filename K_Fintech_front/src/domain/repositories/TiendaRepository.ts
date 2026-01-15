import { TiendaEntity } from '../entities/Tienda';

export interface TiendaRepository {
  getAll(): Promise<TiendaEntity[]>;
  getById(id: number): Promise<TiendaEntity | null>;
  create(tienda: TiendaEntity): Promise<TiendaEntity>;
  update(id: number, tienda: Partial<TiendaEntity>): Promise<TiendaEntity | null>;
  delete(id: number): Promise<boolean>;
  getByUserId(userId: number): Promise<TiendaEntity[]>;
}