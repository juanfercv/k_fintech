import type { MetodoPagoAdminRepository } from '../../repositories/MetodoPagoAdminRepository';

export class CreateMetodoPagoAdminUseCase {
  private metodoPagoRepository: MetodoPagoAdminRepository;
  
  constructor(metodoPagoRepository: MetodoPagoAdminRepository) {
    this.metodoPagoRepository = metodoPagoRepository;
  }

  async execute(metodoPagoData: Omit<import('../../entities/MetodoPagoAdmin').MetodoPagoAdmin, 'id'>): Promise<import('../../entities/MetodoPagoAdmin').MetodoPagoAdmin> {
    return await this.metodoPagoRepository.create(metodoPagoData);
  }
}