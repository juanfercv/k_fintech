import type { MetodoPagoAdminRepository } from '../../repositories/MetodoPagoAdminRepository';

export class DeleteMetodoPagoAdminUseCase {
  private metodoPagoRepository: MetodoPagoAdminRepository;
  
  constructor(metodoPagoRepository: MetodoPagoAdminRepository) {
    this.metodoPagoRepository = metodoPagoRepository;
  }

  async execute(id: number): Promise<boolean> {
    return await this.metodoPagoRepository.delete(id);
  }
}