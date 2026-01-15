import { useState, useCallback } from 'react';

interface ClienteEstadisticas {
  totalFacturado: number;
  facturasPagadas: number;
  facturasPendientes: number;
  facturasAnuladas: number;
  topCliente: string;
  metodoMasUsado: string;
}

export const useClienteViewModel = () => {
  const [estadisticas, setEstadisticas] = useState<ClienteEstadisticas>({
    totalFacturado: 0,
    facturasPagadas: 0,
    facturasPendientes: 0,
    facturasAnuladas: 0,
    topCliente: '',
    metodoMasUsado: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarEstadisticas = useCallback(async () => {
    try {
      setLoading(true);
      // Hacer la llamada al endpoint de estadísticas
      const response = await fetch('/api/dashboard/cliente');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Procesar los datos recibidos
      setEstadisticas({
        totalFacturado: data.totalFacturado || 0,
        facturasPagadas: data.facturasPorEstado?.Pagada || 0,
        facturasPendientes: data.facturasPorEstado?.Pendiente || 0,
        facturasAnuladas: data.facturasPorEstado?.Anulada || 0,
        topCliente: data.topClientes?.[0]?.nombre_cliente || 'N/A',
        metodoMasUsado: data.metodosPagoMasUsados?.[0]?.nombre || 'N/A'
      });
    } catch (err) {
      setError('Error al cargar las estadísticas del cliente');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    estadisticas,
    loading,
    error,
    cargarEstadisticas
  };
};