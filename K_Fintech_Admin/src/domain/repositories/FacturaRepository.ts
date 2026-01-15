import type { Factura, FacturaCreate, FacturaUpdate } from '../entities/Factura';

export interface FacturaRepository {
  getAll(): Promise<Factura[]>;
  getById(id: number): Promise<Factura | null>;
  create(factura: FacturaCreate): Promise<Factura>;
  update(id: number, factura: FacturaUpdate): Promise<Factura | null>;
  delete(id: number): Promise<boolean>;
  getByTienda(tiendaId: number): Promise<Factura[]>;
  getByCliente(clienteId: number): Promise<Factura[]>;
  getByEstado(estado: string): Promise<Factura[]>;
}