import type { FacturaRepository } from '../../repositories/FacturaRepository';
import type { Factura } from '../../entities/Factura';

export class CreateFacturaUseCase {
  private facturaRepository: FacturaRepository;
  
  constructor(facturaRepository: FacturaRepository) {
    this.facturaRepository = facturaRepository;
  }

  async execute(facturaData: Omit<Factura, 'id'>): Promise<Factura> {
    return await this.facturaRepository.create(facturaData);
  }
}