import type { FacturaRepository } from '../../repositories/FacturaRepository';

export class UpdateFacturaUseCase {
  private facturaRepository: FacturaRepository;
  
  constructor(facturaRepository: FacturaRepository) {
    this.facturaRepository = facturaRepository;
  }

  async execute(id: number, facturaData: Partial<Omit<import('../../entities/Factura').Factura, 'id'>>): Promise<import('../../entities/Factura').Factura | null> {
    return await this.facturaRepository.update(id, facturaData);
  }
}