import type { FacturaRepository } from '../../repositories/FacturaRepository';
import type { Factura } from '../../entities/Factura';

export class UpdateFacturaUseCase {
  private facturaRepository: FacturaRepository;
  
  constructor(facturaRepository: FacturaRepository) {
    this.facturaRepository = facturaRepository;
  }

  async execute(id: number, facturaData: Partial<Omit<Factura, 'id'>>): Promise<Factura | null> {
    return await this.facturaRepository.update(id, facturaData);
  }
}