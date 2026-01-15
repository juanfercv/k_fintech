export class MetodoPagoEntity {
  id: number;
  nombre: string;
  codigoInterno: string;
  codigoSRI: string;
  descripcion: string;
  activo: boolean;
  permitePagoDiferido: boolean;
  maximoCuotas: number;
  integracionPasarela: boolean;
  fechaCreacion: Date;
  fechaModificacion: Date;

  constructor(
    id: number,
    nombre: string,
    codigoInterno: string,
    codigoSRI: string,
    descripcion: string,
    activo: boolean,
    permitePagoDiferido: boolean,
    maximoCuotas: number,
    integracionPasarela: boolean,
    fechaCreacion: Date,
    fechaModificacion: Date
  ) {
    this.id = id;
    this.nombre = nombre;
    this.codigoInterno = codigoInterno;
    this.codigoSRI = codigoSRI;
    this.descripcion = descripcion;
    this.activo = activo;
    this.permitePagoDiferido = permitePagoDiferido;
    this.maximoCuotas = maximoCuotas;
    this.integracionPasarela = integracionPasarela;
    this.fechaCreacion = fechaCreacion;
    this.fechaModificacion = fechaModificacion;
  }

  // Métodos de negocio
  isActive(): boolean {
    return this.activo;
  }

  enable(): void {
    this.activo = true;
    this.fechaModificacion = new Date();
  }

  disable(): void {
    this.activo = false;
    this.fechaModificacion = new Date();
  }

  updateMaxCuotas(maxCuotas: number): void {
    this.maximoCuotas = maxCuotas;
    this.fechaModificacion = new Date();
  }

  togglePagoDiferido(): void {
    this.permitePagoDiferido = !this.permitePagoDiferido;
    this.fechaModificacion = new Date();
  }

  getShortDescription(maxLength: number = 100): string {
    return this.descripcion.length > maxLength 
      ? this.descripcion.substring(0, maxLength) + '...' 
      : this.descripcion;
  }
}