import type { TiendaRepository } from '../../domain/repositories/TiendaRepository';
import type { Tienda, TiendaCreate, TiendaUpdate, TiendaFiltros } from '../../domain/entities/Tienda';

export class GetTiendasUseCase {
  private tiendaRepository: TiendaRepository;

  constructor(tiendaRepository: TiendaRepository) {
    this.tiendaRepository = tiendaRepository;
  }

  async execute(): Promise<Tienda[]> {
    return await this.tiendaRepository.getAll();
  }
}

export class GetTiendaByIdUseCase {
  private tiendaRepository: TiendaRepository;

  constructor(tiendaRepository: TiendaRepository) {
    this.tiendaRepository = tiendaRepository;
  }

  async execute(id: number): Promise<Tienda | null> {
    return await this.tiendaRepository.getById(id);
  }
}

export class CreateTiendaUseCase {
  private tiendaRepository: TiendaRepository;

  constructor(tiendaRepository: TiendaRepository) {
    this.tiendaRepository = tiendaRepository;
  }

  async execute(tiendaData: TiendaCreate): Promise<Tienda> {
    return await this.tiendaRepository.create(tiendaData);
  }
}

export class UpdateTiendaUseCase {
  private tiendaRepository: TiendaRepository;

  constructor(tiendaRepository: TiendaRepository) {
    this.tiendaRepository = tiendaRepository;
  }

  async execute(id: number, tiendaData: TiendaUpdate): Promise<Tienda | null> {
    return await this.tiendaRepository.update(id, tiendaData);
  }
}

export class DeleteTiendaUseCase {
  private tiendaRepository: TiendaRepository;

  constructor(tiendaRepository: TiendaRepository) {
    this.tiendaRepository = tiendaRepository;
  }

  async execute(id: number): Promise<boolean> {
    return await this.tiendaRepository.delete(id);
  }
}

export class GetTiendasByFiltrosUseCase {
  private tiendaRepository: TiendaRepository;

  constructor(tiendaRepository: TiendaRepository) {
    this.tiendaRepository = tiendaRepository;
  }

  async execute(filtros: TiendaFiltros): Promise<Tienda[]> {
    return await this.tiendaRepository.getByFiltros(filtros);
  }
}

export class GetTiendasByEstadoUseCase {
  private tiendaRepository: TiendaRepository;

  constructor(tiendaRepository: TiendaRepository) {
    this.tiendaRepository = tiendaRepository;
  }

  async execute(estado: 'activa' | 'inactiva'): Promise<Tienda[]> {
    return await this.tiendaRepository.getByEstado(estado);
  }
}

export class GetTiendasByCiudadUseCase {
  private tiendaRepository: TiendaRepository;

  constructor(tiendaRepository: TiendaRepository) {
    this.tiendaRepository = tiendaRepository;
  }

  async execute(ciudad: string): Promise<Tienda[]> {
    return await this.tiendaRepository.getByCiudad(ciudad);
  }
}