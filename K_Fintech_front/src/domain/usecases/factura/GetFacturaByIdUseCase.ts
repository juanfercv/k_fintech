import type { FacturaRepository } from '../../repositories/FacturaRepository';

export class GetFacturaByIdUseCase {
  private facturaRepository: FacturaRepository;
  
  constructor(facturaRepository: FacturaRepository) {
    this.facturaRepository = facturaRepository;
  }

  async execute(id: number): Promise<import('../../entities/Factura').Factura | null> {
    return await this.facturaRepository.getById(id);
  }
}