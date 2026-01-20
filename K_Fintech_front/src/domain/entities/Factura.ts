export interface DetalleFactura {
    id_detalle_factura?: number;
    descripcion: string;
    cantidad: number;
    precio_unitario: number;
    precio_total: number;
}

export interface Factura {
    idFactura?: number;
    idTienda: number;
    idCliente: number;
    idFormaPago?: number;
    fecha_emision: string;
    estado_factura: string; 
    detalles?: DetalleFactura[]; 
    subtotal?: number;
    iva?: number;
    total?: number;
}