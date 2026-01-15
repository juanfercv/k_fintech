import type { MetodoPagoEntity } from '../entities/MetodoPago';

export interface MetodoPagoRepository {
  getAll(): Promise<MetodoPagoEntity[]>;
  getById(id: number): Promise<MetodoPagoEntity | null>;
  create(metodo: MetodoPagoEntity): Promise<MetodoPagoEntity>;
  update(id: number, metodo: Partial<MetodoPagoEntity>): Promise<MetodoPagoEntity | null>;
  delete(id: number): Promise<boolean>;
  getActive(): Promise<MetodoPagoEntity[]>;
}