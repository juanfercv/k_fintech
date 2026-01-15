import type { MetodoPagoAdminRepository } from '../../repositories/MetodoPagoAdminRepository';

export class GetMetodosPagoAdminUseCase {
  private metodoPagoRepository: MetodoPagoAdminRepository;
  
  constructor(metodoPagoRepository: MetodoPagoAdminRepository) {
    this.metodoPagoRepository = metodoPagoRepository;
  }

  async execute(): Promise<import('../../entities/MetodoPagoAdmin').MetodoPagoAdmin[]> {
    return await this.metodoPagoRepository.getAll();
  }
}