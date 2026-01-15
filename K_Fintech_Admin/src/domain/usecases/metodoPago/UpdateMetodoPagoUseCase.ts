import type { MetodoPagoRepository } from '../../repositories/MetodoPagoRepository';
import { MetodoPagoEntity } from '../../entities/MetodoPago';

export class UpdateMetodoPagoUseCase {
  private metodoPagoRepository: MetodoPagoRepository;

  constructor(metodoPagoRepository: MetodoPagoRepository) {
    this.metodoPagoRepository = metodoPagoRepository;
  }

  async execute(id: number, updates: Partial<MetodoPagoEntity>): Promise<MetodoPagoEntity | null> {
    return await this.metodoPagoRepository.update(id, updates);
  }
}