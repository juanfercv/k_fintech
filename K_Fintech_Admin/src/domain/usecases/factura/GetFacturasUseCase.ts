import type { FacturaRepository } from '../../domain/repositories/FacturaRepository';
import type { Factura } from '../../domain/entities/Factura';

export class GetFacturasUseCase {
  private facturaRepository: FacturaRepository;

  constructor(facturaRepository: FacturaRepository) {
    this.facturaRepository = facturaRepository;
  }

  async execute(): Promise<Factura[]> {
    return await this.facturaRepository.getAll();
  }
}