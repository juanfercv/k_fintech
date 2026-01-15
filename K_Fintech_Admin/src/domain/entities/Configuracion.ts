// Parámetros Generales del Sistema
export interface ParametrosGenerales {
  id: number;
  moneda: {
    codigo: string; // USD, EUR, COP, etc.
    simbolo: string; // $, €, $
    nombre: string; // Dólar, Euro, Peso Colombiano
    decimales: number; // 2 para dólares, 0 para pesos enteros
  };
  pais: {
    codigo: string; // CO, EC, MX, etc.
    nombre: string;
    codigoTelefono: string;
  };
  impuestos: {
    iva: {
      porcentaje: number; // 19%, 12%, etc.
      activo: boolean;
    };
    ice: {
      porcentaje: number;
      activo: boolean;
    };
    retencionFuente: {
      porcentaje: number;
      activo: boolean;
    };
  };
  formatoDocumentos: {
    prefijoFactura: string; // FAC-, INV-, etc.
    longitudSecuencia: number; // 6, 8, 10 dígitos
    incluirAnio: boolean;
    incluirMes: boolean;
    separador: string; // -, /, .
  };
  createdAt?: string;
  updatedAt?: string;
}

// Roles del Sistema
export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  nivel: number; // 1=admin general, 2=admin tienda, 3=cajero
  permisos: {
    tiendas: string[]; // ['leer', 'crear', 'editar', 'eliminar']
    facturas: string[]; // ['leer', 'crear', 'editar', 'anular', 'reportes']
    clientes: string[];
    metodosPago: string[];
    configuracion: string[]; // Solo para admin general
  };
  createdAt?: string;
  updatedAt?: string;
}

// Usuarios del Sistema
export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  username: string;
  password?: string; // Solo para creación/actualización
  rolId: number;
  rol?: Rol;
  tiendaId?: number; // Solo para admin tienda y cajeros
  tienda?: any; // Referencia a Tienda
  estado: 'activo' | 'inactivo';
  ultimoLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Integraciones Externas
export interface Integracion {
  id: number;
  servicio: 'sri' | 'correo' | 'pasarela_pago' | 'otros';
  nombre: string;
  configuracion: {
    // Para SRI
    ambiente?: 'produccion' | 'pruebas';
    claveAcceso?: string;
    urlRecepcion?: string;
    urlAutorizacion?: string;
    // Para Correo
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPass?: string;
    remitente?: string;
    // Para Pasarelas de Pago
    apiKey?: string;
    secretKey?: string;
    merchantId?: string;
    urlCallback?: string;
    // Campos genéricos
    activo: boolean;
    timeout?: number; // segundos
  };
  createdAt?: string;
  updatedAt?: string;
}

// Configuración Completa del Sistema
export interface ConfiguracionSistema {
  parametrosGenerales: ParametrosGenerales;
  roles: Rol[];
  usuarios: Usuario[];
  integraciones: Integracion[];
}

// Tipos para formularios
export interface ParametrosGeneralesCreate {
  moneda: ParametrosGenerales['moneda'];
  pais: ParametrosGenerales['pais'];
  impuestos: ParametrosGenerales['impuestos'];
  formatoDocumentos: ParametrosGenerales['formatoDocumentos'];
}

export interface RolCreate {
  nombre: string;
  descripcion: string;
  nivel: number;
  permisos: Rol['permisos'];
}

export interface UsuarioCreate {
  nombres: string;
  apellidos: string;
  email: string;
  username: string;
  password: string;
  rolId: number;
  tiendaId?: number;
  estado: 'activo' | 'inactivo';
}

export interface IntegracionCreate {
  servicio: Integracion['servicio'];
  nombre: string;
  configuracion: Integracion['configuracion'];
}