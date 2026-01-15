import type { MetodoPagoRepository } from '../../repositories/MetodoPagoRepository';

export class DeleteMetodoPagoUseCase {
  private metodoPagoRepository: MetodoPagoRepository;

  constructor(metodoPagoRepository: MetodoPagoRepository) {
    this.metodoPagoRepository = metodoPagoRepository;
  }

  async execute(id: number): Promise<boolean> {
    return await this.metodoPagoRepository.delete(id);
  }
}