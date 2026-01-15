import type { FacturaRepository } from '../repositories/FacturaRepository';
import type { Factura } from '../entities/Factura';

export class GetFacturasUseCase {
  private facturaRepository: FacturaRepository;

  constructor(facturaRepository: FacturaRepository) {
    this.facturaRepository = facturaRepository;
  }

  async execute(): Promise<Factura[]> {
    return await this.facturaRepository.getAll();
  }
}

export class GetFacturaByIdUseCase {
  private facturaRepository: FacturaRepository;

  constructor(facturaRepository: FacturaRepository) {
    this.facturaRepository = facturaRepository;
  }

  async execute(id: number): Promise<Factura | null> {
    return await this.facturaRepository.getById(id);
  }
}

export class CreateFacturaUseCase {
  private facturaRepository: FacturaRepository;

  constructor(facturaRepository: FacturaRepository) {
    this.facturaRepository = facturaRepository;
  }

  async execute(facturaData: any): Promise<Factura> {
    return await this.facturaRepository.create(facturaData);
  }
}

export class UpdateFacturaUseCase {
  private facturaRepository: FacturaRepository;

  constructor(facturaRepository: FacturaRepository) {
    this.facturaRepository = facturaRepository;
  }

  async execute(id: number, facturaData: any): Promise<Factura | null> {
    return await this.facturaRepository.update(id, facturaData);
  }
}

export class DeleteFacturaUseCase {
  private facturaRepository: FacturaRepository;

  constructor(facturaRepository: FacturaRepository) {
    this.facturaRepository = facturaRepository;
  }

  async execute(id: number): Promise<boolean> {
    return await this.facturaRepository.delete(id);
  }
}