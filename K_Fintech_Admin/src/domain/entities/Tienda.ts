export interface Tienda {
  idTienda: number;
  fotoTienda?: string;
  nombreTienda: string;
  dueñoTienda: string;
  RUCTienda: string;
  dirección_matriz_tienda: string;
  direccion_sucursal_tienda?: string;
  correo_electronico_tienda: string;
  telefono: string;
  estado: 'activa' | 'inactiva';
  crearTienda?: string;
  actualizarTienda?: string;
  // Campos adicionales para puntos de emisión
  codigoPuntoEmision?: string;
  ciudad?: string;
  // Configuración de facturación
  configuracionFacturacion?: {
    ambiente: 'produccion' | 'pruebas';
    tipoEmision: 'normal' | 'contingencia';
    secuencialInicio?: number;
  };
}

export interface TiendaCreate {
  fotoTienda?: string;
  nombreTienda: string;
  dueñoTienda: string;
  RUCTienda: string;
  dirección_matriz_tienda: string;
  direccion_sucursal_tienda?: string;
  correo_electronico_tienda: string;
  telefono: string;
  estado: 'activa' | 'inactiva';
  codigoPuntoEmision?: string;
  ciudad?: string;
  configuracionFacturacion?: {
    ambiente: 'produccion' | 'pruebas';
    tipoEmision: 'normal' | 'contingencia';
    secuencialInicio?: number;
  };
}

export interface TiendaUpdate {
  fotoTienda?: string;
  nombreTienda?: string;
  dueñoTienda?: string;
  RUCTienda?: string;
  dirección_matriz_tienda?: string;
  direccion_sucursal_tienda?: string;
  correo_electronico_tienda?: string;
  telefono?: string;
  estado?: 'activa' | 'inactiva';
  codigoPuntoEmision?: string;
  ciudad?: string;
  configuracionFacturacion?: {
    ambiente?: 'produccion' | 'pruebas';
    tipoEmision?: 'normal' | 'contingencia';
    secuencialInicio?: number;
  };
}

export interface TiendaFiltros {
  estado?: 'activa' | 'inactiva';
  ciudad?: string;
  nombre?: string;
}