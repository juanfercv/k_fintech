import type { MetodoPagoRepository } from '../../repositories/MetodoPagoRepository';
import { MetodoPagoEntity } from '../../entities/MetodoPago';

export class GetMetodosPagoUseCase {
  private metodoPagoRepository: MetodoPagoRepository;

  constructor(metodoPagoRepository: MetodoPagoRepository) {
    this.metodoPagoRepository = metodoPagoRepository;
  }

  async execute(): Promise<MetodoPagoEntity[]> {
    return await this.metodoPagoRepository.getAll();
  }
}