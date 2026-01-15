import React, { useState, useEffect } from 'react';

interface EstadoFactura {
  estado: string;
  count: number;
}

const DashboardCliente: React.FC = () => {
  const [estadisticas, setEstadisticas] = useState({
    totalFacturado: 0,
    facturasPagadas: 0,
    facturasPendientes: 0,
    facturasAnuladas: 0,
    topCliente: '',
    metodoMasUsado: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      // Hacer la llamada al nuevo endpoint de estadísticas
      const response = await fetch('/api/dashboard/cliente');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
        
      // Procesar los datos recibidos
      let facturasPagadas = 0;
      let facturasPendientes = 0;
      let facturasAnuladas = 0;
        
      if (data.facturasPorEstado && Array.isArray(data.facturasPorEstado)) {
        data.facturasPorEstado.forEach((estado: EstadoFactura) => {
          if (estado.estado === 'Pagada') facturasPagadas = estado.count || 0;
          if (estado.estado === 'Pendiente') facturasPendientes = estado.count || 0;
          if (estado.estado === 'Anulada') facturasAnuladas = estado.count || 0;
        });
      }
        
      const topClienteNombre = data.topClientes && Array.isArray(data.topClientes) && data.topClientes[0] 
        ? (data.topClientes[0].nombre_cliente || data.topClientes[0].Cliente?.nombre_cliente || 'N/A') 
        : 'N/A';
        
      const metodoMasUsadoNombre = data.metodosPagoMasUsados && Array.isArray(data.metodosPagoMasUsados) && data.metodosPagoMasUsados[0] 
        ? (data.metodosPagoMasUsados[0].nombre || data.metodosPagoMasUsados[0].FormaPago?.nombre || 'N/A') 
        : 'N/A';
        
      setEstadisticas({
        totalFacturado: parseFloat(data.totalFacturado) || 0,
        facturasPagadas,
        facturasPendientes,
        facturasAnuladas,
        topCliente: topClienteNombre,
        metodoMasUsado: metodoMasUsadoNombre
      });
    } catch (err) {
      console.error('Error al cargar las estadísticas:', err);
      setError('Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="view-container">
        <h2>Dashboard Cliente</h2>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-container">
        <h2>Dashboard Cliente</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="view-container">
      <h2>Dashboard Cliente</h2>
      
      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Total Facturado</h3>
          <p>${(typeof estadisticas.totalFacturado === 'number' ? estadisticas.totalFacturado : 0).toFixed(2)}</p>
        </div>
        
        <div className="stat-card">
          <h3>Facturas Pagadas</h3>
          <p>{estadisticas.facturasPagadas}</p>
        </div>
        
        <div className="stat-card">
          <h3>Facturas Pendientes</h3>
          <p>{estadisticas.facturasPendientes}</p>
        </div>
        
        <div className="stat-card">
          <h3>Facturas Anuladas</h3>
          <p>{estadisticas.facturasAnuladas}</p>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Top Cliente</h3>
          <p>{estadisticas.topCliente}</p>
        </div>
        
        <div className="stat-card">
          <h3>Método de Pago Más Usado</h3>
          <p>{estadisticas.metodoMasUsado}</p>
        </div>
      </div>
      
      <div className="atajos-container" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>Acciones Rápidas</h3>
        <div className="atajos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          <button className="btn btn-primary">Ver Mis Facturas</button>
          <button className="btn btn-primary">Nueva Factura</button>
          <button className="btn btn-primary">Ver Métodos de Pago</button>
          <button className="btn btn-primary">Ver Datos de Tienda</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCliente;