import type { FacturaRepository } from '../../repositories/FacturaRepository';

export class GetFacturasUseCase {
  private facturaRepository: FacturaRepository;
  
  constructor(facturaRepository: FacturaRepository) {
    this.facturaRepository = facturaRepository;
  }

  async execute(): Promise<import('../../entities/Factura').Factura[]> {
    return await this.facturaRepository.getAll();
  }
}