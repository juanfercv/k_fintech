export interface MetodoPagoAdmin {
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
  // Configuraciones adicionales para admin
  habilitadoPorTienda: boolean;
  configuracionTiendas: string[]; // IDs de tiendas donde está habilitado
}