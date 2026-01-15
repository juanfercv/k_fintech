import type { MetodoPagoAdminRepository } from '../../repositories/MetodoPagoAdminRepository';

export class UpdateMetodoPagoAdminUseCase {
  private metodoPagoRepository: MetodoPagoAdminRepository;
  
  constructor(metodoPagoRepository: MetodoPagoAdminRepository) {
    this.metodoPagoRepository = metodoPagoRepository;
  }

  async execute(id: number, metodoPagoData: Partial<Omit<import('../../entities/MetodoPagoAdmin').MetodoPagoAdmin, 'id'>>): Promise<import('../../entities/MetodoPagoAdmin').MetodoPagoAdmin | null> {
    return await this.metodoPagoRepository.update(id, metodoPagoData);
  }
}