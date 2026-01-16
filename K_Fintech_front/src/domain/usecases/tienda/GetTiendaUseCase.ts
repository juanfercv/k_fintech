// domain/usecases/tienda/GetTiendasUseCase.ts
import type { TiendaRepository } from '../../repositories/TiendaRepository';
import type { Tienda } from '../../entities/Tienda';

export class GetTiendasUseCase {
  private repo: TiendaRepository;

  constructor(repo: TiendaRepository) {
    this.repo = repo;
  }

  async execute(): Promise<Tienda[]> {
    return this.repo.getAll();
  }
}
