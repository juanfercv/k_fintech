import type { TiendaRepository } from '../../repositories/TiendaRepository';
import { TiendaEntity } from '../../entities/Tienda';

export class GetTiendaUseCase {
  private tiendaRepository: TiendaRepository;

  constructor(tiendaRepository: TiendaRepository) {
    this.tiendaRepository = tiendaRepository;
  }

  async execute(userId: number): Promise<TiendaEntity[]> {
    return await this.tiendaRepository.getByUserId(userId);
  }
}