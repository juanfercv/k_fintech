import type { MetodoPagoAdmin } from '../entities/MetodoPagoAdmin';

export interface MetodoPagoAdminRepository {
  getAll(): Promise<MetodoPagoAdmin[]>;
  getById(id: number): Promise<MetodoPagoAdmin | null>;
  create(metodoPago: Omit<MetodoPagoAdmin, 'id'>): Promise<MetodoPagoAdmin>;
  update(id: number, metodoPago: Partial<Omit<MetodoPagoAdmin, 'id'>>): Promise<MetodoPagoAdmin | null>;
  delete(id: number): Promise<boolean>;
}