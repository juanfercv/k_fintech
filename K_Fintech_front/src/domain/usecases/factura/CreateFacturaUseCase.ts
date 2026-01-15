import type { FacturaRepository } from '../../repositories/FacturaRepository';

export class CreateFacturaUseCase {
  private facturaRepository: FacturaRepository;
  
  constructor(facturaRepository: FacturaRepository) {
    this.facturaRepository = facturaRepository;
  }

  async execute(facturaData: Omit<import('../../entities/Factura').Factura, 'id'>): Promise<import('../../entities/Factura').Factura> {
    return await this.facturaRepository.create(facturaData);
  }
}