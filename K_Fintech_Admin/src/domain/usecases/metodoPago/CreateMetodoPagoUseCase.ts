import type { MetodoPagoRepository } from '../../repositories/MetodoPagoRepository';
import { MetodoPagoEntity } from '../../entities/MetodoPago';

export class CreateMetodoPagoUseCase {
  private metodoPagoRepository: MetodoPagoRepository;

  constructor(metodoPagoRepository: MetodoPagoRepository) {
    this.metodoPagoRepository = metodoPagoRepository;
  }

  async execute(nombre: string, descripcion: string, activo: boolean): Promise<MetodoPagoEntity> {
    const nuevoMetodo = new MetodoPagoEntity(
      0, // El ID será asignado por el sistema
      nombre,
      descripcion,
      activo
    );
    
    return await this.metodoPagoRepository.create(nuevoMetodo);
  }
}