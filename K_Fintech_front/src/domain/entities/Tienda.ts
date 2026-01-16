// 📌 ENTIDAD PRINCIPAL (lo que el backend devuelve)
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

  // Puntos de emisión
  codigoPuntoEmision?: string;
  ciudad?: string;

  // Configuración de facturación
  configuracionFacturacion?: {
    ambiente: 'produccion' | 'pruebas';
    tipoEmision: 'normal' | 'contingencia';
    secuencialInicio?: number;
  };
}

// 📌 PARA CREAR TIENDA
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

// 📌 PARA ACTUALIZACIONES
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

// 📌 Para buscar por filtros
export interface TiendaFiltros {
  estado?: 'activa' | 'inactiva';
  ciudad?: string;
  nombre?: string;
}
