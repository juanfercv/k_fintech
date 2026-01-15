export interface MetodoPago {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export class MetodoPagoEntity {
  readonly id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;

  constructor(id: number, nombre: string, descripcion: string, activo: boolean) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.activo = activo;
  }

  // Método estático para crear desde la respuesta del backend
  static fromBackend(backendData: { id_forma_pago: number; nombre: string; descripcion: string; activo: boolean }): MetodoPagoEntity {
    return new MetodoPagoEntity(
      backendData.id_forma_pago,
      backendData.nombre,
      backendData.descripcion,
      backendData.activo
    );
  }
}