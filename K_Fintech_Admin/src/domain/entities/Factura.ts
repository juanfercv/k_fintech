export interface Factura {
  idFactura: number;
  fecha_emision: string;
  idTienda: number;
  idCliente: number;
  idFormaPago: number;
  estado_factura: string;
  detalle: string;
  total: number;
  crearFactura?: string;
  actualizarFactura?: string;
}

export interface FacturaCreate {
  fecha_emision: string;
  idTienda: number;
  idCliente: number;
  idFormaPago: number;
  estado_factura: string;
  detalle: string;
  total: number;
}

export interface FacturaUpdate {
  fecha_emision?: string;
  idTienda?: number;
  idCliente?: number;
  idFormaPago?: number;
  estado_factura?: string;
  detalle?: string;
  total?: number;
}