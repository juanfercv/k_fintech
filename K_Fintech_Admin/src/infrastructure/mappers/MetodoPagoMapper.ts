import { MetodoPagoEntity } from '../../domain/entities/MetodoPago';

// Interface for API response
interface MetodoPagoAPI {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

// Mapper functions
export function toDomainMetodoPago(apiData: MetodoPagoAPI): MetodoPagoEntity {
  return new MetodoPagoEntity(
    apiData.id,
    apiData.nombre,
    '', // codigoInterno - not provided by API
    '', // codigoSRI - not provided by API
    apiData.descripcion,
    apiData.activo,
    false, // permitePagoDiferido - default false
    1, // maximoCuotas - default 1
    false, // integracionPasarela - default false
    new Date(), // fechaCreacion - default now
    new Date() // fechaModificacion - default now
  );
}

export function toServiceMetodoPago(entity: MetodoPagoEntity): MetodoPagoAPI {
  return {
    id: entity.id,
    nombre: entity.nombre,
    descripcion: entity.descripcion,
    activo: entity.activo
  };
}

export function toPartialServiceMetodoPago(partialEntity: Partial<MetodoPagoEntity>): Partial<MetodoPagoAPI> {
  const result: Partial<MetodoPagoAPI> = {};
  
  if (partialEntity.id !== undefined) result.id = partialEntity.id;
  if (partialEntity.nombre !== undefined) result.nombre = partialEntity.nombre;
  if (partialEntity.descripcion !== undefined) result.descripcion = partialEntity.descripcion;
  if (partialEntity.activo !== undefined) result.activo = partialEntity.activo;
  
  return result;
}