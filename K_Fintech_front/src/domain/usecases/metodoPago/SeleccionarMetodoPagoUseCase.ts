import type { MetodoPagoRepository } from '../../repositories/MetodoPagoRepository';
import { MetodoPagoEntity } from '../../entities/MetodoPago';

export class SeleccionarMetodoPagoUseCase {
  private metodoPagoRepository: MetodoPagoRepository;

  constructor(metodoPagoRepository: MetodoPagoRepository) {
    this.metodoPagoRepository = metodoPagoRepository;
  }

  async execute(metodoIds: number[]): Promise<MetodoPagoEntity[]> {
    const metodos: MetodoPagoEntity[] = [];
    
    for (const id of metodoIds) {
      const metodo = await this.metodoPagoRepository.getById(id);
      if (metodo) {
        metodos.push(metodo);
      }
    }
    
    return metodos;
  }
}