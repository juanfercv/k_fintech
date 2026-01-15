export interface TiendaDomain {
  id: number;
  nombre: string;
  puntoEmision: string;
  direccion: string;
  contacto: string;
  telefono: string;
  correo: string;
  ruc: string;
}

export class TiendaEntity {
  readonly id: number;
  nombre: string;
  puntoEmision: string;
  direccion: string;
  contacto: string;
  telefono: string;
  correo: string;
  ruc: string;

  constructor(
    id: number,
    nombre: string,
    puntoEmision: string,
    direccion: string,
    contacto: string,
    telefono: string,
    correo: string,
    ruc: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.puntoEmision = puntoEmision;
    this.direccion = direccion;
    this.contacto = contacto;
    this.telefono = telefono;
    this.correo = correo;
    this.ruc = ruc;
  }
}