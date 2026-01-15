// Type definitions for api.js
// This file provides type definitions for the JavaScript API module

export interface Tienda {
  idTienda: number;
  fotoTienda: string;
  nombreTienda: string;
  dueñoTienda: string;
  RUCTienda: string;
  dirección_matriz_tienda: string;
  direccion_sucursal_tienda: string;
  correo_electronico_tienda: string;
  telefono: string;
}

export interface Cliente {
  id_cliente: number;
  nombre_cliente: string;
  direccion_cliente: string;
  correo_cliente: string;
  celular_cliente: string;
  cedula_cliente: string;
}

export interface TiendaService {
  getAll: () => Promise<Tienda[]>;
  getById: (id: number) => Promise<Tienda>;
  create: (data: Partial<Tienda>) => Promise<Tienda>;
  update: (id: number, data: Partial<Tienda>) => Promise<Tienda>;
  delete: (id: number) => Promise<void>;
}

export interface ClienteService {
  getAll: () => Promise<Cliente[]>;
  getById: (id: number) => Promise<Cliente>;
  create: (data: Partial<Cliente>) => Promise<Cliente>;
  update: (id: number, data: Partial<Cliente>) => Promise<Cliente>;
  delete: (id: number) => Promise<void>;
}

export interface MetodoPago {
  id_forma_pago: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  crearFormaPago?: string;
  actualizarFormaPago?: string;
}

export interface MetodoPagoService {
  getAll: () => Promise<MetodoPago[]>;
  getActive: () => Promise<MetodoPago[]>;
  getById: (id: number) => Promise<MetodoPago>;
  create: (data: Partial<MetodoPago>) => Promise<MetodoPago>;
  update: (id: number, data: Partial<MetodoPago>) => Promise<MetodoPago>;
  delete: (id: number) => Promise<void>;
}

export interface Factura {
  idFactura: number;
  fecha_emision: string;
  idTienda: number;
  idCliente: number;
  idFormaPago: number;
  estado_factura: string;
  detalle: string;
  total: number;
}

export interface FacturaService {
  getAll: () => Promise<Factura[]>;
  getById: (id: number) => Promise<Factura>;
  create: (data: Partial<Factura>) => Promise<Factura>;
  update: (id: number, data: Partial<Factura>) => Promise<Factura>;
  delete: (id: number) => Promise<void>;
}

export const tiendaService: TiendaService;
export const clienteService: ClienteService;
export const metodoPagoService: MetodoPagoService;
export const facturaService: FacturaService;

const api: {
  tiendaService: TiendaService;
  clienteService: ClienteService;
  metodoPagoService: MetodoPagoService;
  facturaService: FacturaService;
};

export default api;