import type { Factura } from '../entities/Factura';

export interface FacturaRepository {
  getAll(): Promise<Factura[]>;
  getById(id: number): Promise<Factura | null>;
  create(factura: Omit<Factura, 'id'>): Promise<Factura>;
  update(id: number, factura: Partial<Omit<Factura, 'id'>>): Promise<Factura | null>;
  delete(id: number): Promise<boolean>;
}