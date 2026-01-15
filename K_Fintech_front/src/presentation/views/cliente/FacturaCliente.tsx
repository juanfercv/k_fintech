import React, { useState, useEffect } from 'react';
import { facturaService, type Factura } from '../../../services/api';

const FacturaCliente: React.FC = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState({
    estado: '',
    fechaInicio: '',
    fechaFin: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [currentFactura, setCurrentFactura] = useState<Factura | null>(null);

  // Datos de ejemplo para demostración
  const idCliente = 1; // En una implementación real, esto vendría del contexto de autenticación

  // Cargar facturas usando el servicio API
  const cargarFacturas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure facturas is always an array
      setFacturas([]);
      
      // Usar facturaService.getAll() y filtrar por cliente
      const todasFacturas = await facturaService.getAll();
      const facturasCliente = todasFacturas.filter(f => f.idCliente === idCliente);
      
      // Aplicar filtros adicionales
      let facturasFiltradas = facturasCliente;
      if (filtros.estado) {
        facturasFiltradas = facturasFiltradas.filter(f => f.estado_factura === filtros.estado);
      }
      if (filtros.fechaInicio) {
        facturasFiltradas = facturasFiltradas.filter(f => f.fecha_emision >= filtros.fechaInicio);
      }
      if (filtros.fechaFin) {
        facturasFiltradas = facturasFiltradas.filter(f => f.fecha_emision <= filtros.fechaFin);
      }
      
      setFacturas(facturasFiltradas);
    } catch (err) {
      setError('Error al cargar facturas');
      console.error(err);
      // Datos fallback en caso de error
      const mockData: Factura[] = [
        {
          idFactura: 1,
          fecha_emision: '2024-01-15T10:30:00Z',
          idTienda: 1,
          idCliente: 1,
          idFormaPago: 1,
          estado_factura: 'Pagada',
          detalle: 'Compra de productos varios',
          total: 112.00
        }
      ];
      setFacturas(mockData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarFacturas();
  }, [filtros]);

  const handleFiltrar = (e: React.FormEvent) => {
    e.preventDefault();
    cargarFacturas();
  };

  const handleVerDetalle = (factura: Factura) => {
    setCurrentFactura(factura);
    setShowForm(true);
  };

  const handleCancelar = () => {
    setShowForm(false);
    setCurrentFactura(null);
  };

  const descargarPDF = (factura: Factura) => {
    console.log(`Descargando PDF de factura ${factura.idFactura}`);
    // Implementar descarga real
  };

  const descargarXML = (factura: Factura) => {
    console.log(`Descargando XML de factura ${factura.idFactura}`);
    // Implementar descarga real
  };

  const pagarFactura = (factura: Factura) => {
    console.log(`Procesando pago de factura ${factura.idFactura}`);
    // Implementar proceso de pago
  };

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button className="btn btn-primary ms-3" onClick={cargarFacturas}>
            <i className="fas fa-sync-alt me-2"></i>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando sus facturas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-gradient-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="mb-0">
                    <i className="fas fa-file-invoice me-3"></i>
                    Mis Facturas
                  </h1>
                  <p className="mb-0 opacity-75">Historial completo de documentos fiscales</p>
                </div>
                <div className="text-end">
                  <div className="h5 mb-0">Total Facturado</div>
                  <div className="display-6 mb-0">
                    ${(Array.isArray(facturas) ? facturas.reduce((sum, f) => sum + (f.estado_factura === 'Pagada' ? f.total : 0), 0) : 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleFiltrar} className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Estado</label>
                  <select 
                    className="form-select"
                    value={filtros.estado}
                    onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                  >
                    <option value="">Todos</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Pagada">Pagada</option>
                    <option value="Anulada">Anulada</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Fecha Inicio</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filtros.fechaInicio}
                    onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Fecha Fin</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filtros.fechaFin}
                    onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}
                  />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button type="submit" className="btn btn-primary w-100">
                    <i className="fas fa-search me-2"></i>
                    Filtrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Facturas */}
      <div className="row">
        {Array.isArray(facturas) && facturas.length > 0 ? (
          facturas.map((factura) => (
            <div key={factura.idFactura} className="col-xl-4 col-md-6 mb-4">
              <div className="card shadow h-100 border-left-info">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-3">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                        Factura #{factura.idFactura}
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        ${factura.total.toFixed(2)}
                      </div>
                      <div className="mt-2">
                        <span className={`badge ${
                          factura.estado_factura === 'Pagada' ? 'bg-success' :
                          factura.estado_factura === 'Pendiente' ? 'bg-warning' :
                          'bg-danger'
                        }`}>
                          {factura.estado_factura}
                        </span>
                      </div>
                      <div className="mt-2 text-muted small">
                        <i className="fas fa-calendar me-1"></i>
                        {new Date(factura.fecha_emision).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className="icon-circle bg-info text-white">
                        <i className="fas fa-file-invoice fa-2x"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-light">
                  <div className="d-flex justify-content-between">
                    <button 
                      className="btn btn-outline-info btn-sm"
                      onClick={() => handleVerDetalle(factura)}
                    >
                      <i className="fas fa-eye me-1"></i>
                      Ver Detalle
                    </button>
                    <div>
                      <button 
                        className="btn btn-outline-success btn-sm me-1"
                        onClick={() => descargarPDF(factura)}
                      >
                        <i className="fas fa-file-pdf"></i>
                      </button>
                      <button 
                        className="btn btn-outline-warning btn-sm"
                        onClick={() => descargarXML(factura)}
                      >
                        <i className="fas fa-file-code"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info text-center">
              <i className="fas fa-info-circle me-2"></i>
              No se encontraron facturas con los filtros aplicados
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      {showForm && currentFactura && (
        <div className="modal fade show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-file-invoice me-2"></i>
                  Detalle de Factura
                </h5>
                <button type="button" className="btn-close" onClick={handleCancelar}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Número: #{currentFactura.idFactura}</h6>
                    <p className="text-muted">
                      <i className="fas fa-calendar me-1"></i>
                      {new Date(currentFactura.fecha_emision).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-md-6 text-end">
                    <h4 className="text-primary">${currentFactura.total.toFixed(2)}</h4>
                    <span className={`badge ${
                      currentFactura.estado_factura === 'Pagada' ? 'bg-success' :
                      currentFactura.estado_factura === 'Pendiente' ? 'bg-warning' :
                      'bg-danger'
                    }`}>
                      {currentFactura.estado_factura}
                    </span>
                  </div>
                </div>
                <hr/>
                <div className="row">
                  <div className="col-12">
                    <h6>Descripción:</h6>
                    <p>{currentFactura.detalle || 'Sin descripción'}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelar}>
                  Cerrar
                </button>
                {currentFactura.estado_factura === 'Pendiente' && (
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={() => pagarFactura(currentFactura)}
                  >
                    <i className="fas fa-credit-card me-1"></i>
                    Pagar Factura
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturaCliente;