import type { FacturaRepository } from '../../repositories/FacturaRepository';

export class DeleteFacturaUseCase {
  private facturaRepository: FacturaRepository;
  
  constructor(facturaRepository: FacturaRepository) {
    this.facturaRepository = facturaRepository;
  }

  async execute(id: number): Promise<boolean> {
    return await this.facturaRepository.delete(id);
  }
}