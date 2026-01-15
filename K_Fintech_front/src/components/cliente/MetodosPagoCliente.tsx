import React, { useState, useEffect } from 'react';
import { metodoPagoService, type MetodoPago } from '../../services/api';

const MetodosPagoCliente: React.FC = () => {
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarMetodosPago = async () => {
    try {
      setLoading(true);
      const data = await metodoPagoService.getActive();
      setMetodosPago(data);
    } catch (err) {
      setError('Error al cargar métodos de pago');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMetodosPago();
  }, []);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid fade-in">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-gradient-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="mb-0">
                    <i className="fas fa-credit-card me-3"></i>
                    Métodos de Pago Disponibles
                  </h1>
                  <p className="mb-0 opacity-75">Formas de pago habilitadas por el administrador</p>
                </div>
                <div className="text-end">
                  <span className="badge bg-light text-dark fs-6">
                    <i className="fas fa-check-circle me-1"></i>
                    {metodosPago.length} métodos activos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row mb-4">
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Métodos Activos
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {metodosPago.length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-credit-card fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Pagos Instantáneos
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {metodosPago.filter(m => ['EFECTIVO', 'TARJETA'].includes(m.nombre.toUpperCase())).length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-bolt fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Pagos Diferidos
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {metodosPago.filter(m => m.nombre.toUpperCase().includes('CRÉDITO')).length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Métodos de Pago */}
      <div className="row">
        {metodosPago.map((metodo) => (
          <div key={metodo.id_forma_pago} className="col-xl-4 col-md-6 mb-4">
            <div className="card shadow h-100 border-left-warning">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-3">
                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                      {metodo.nombre}
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {metodo.descripcion || 'Método de pago disponible'}
                    </div>
                    <div className="mt-2">
                      <span className="badge bg-success">
                        <i className="fas fa-check me-1"></i>
                        Activo
                      </span>
                      {metodo.nombre.toUpperCase().includes('TARJETA') && (
                        <span className="badge bg-info ms-1">
                          <i className="fas fa-lock me-1"></i>
                          Seguro
                        </span>
                      )}
                      {metodo.nombre.toUpperCase().includes('CRÉDITO') && (
                        <span className="badge bg-warning ms-1">
                          <i className="fas fa-clock me-1"></i>
                          Diferido
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="icon-circle bg-warning text-white">
                      {metodo.nombre.toUpperCase().includes('EFECTIVO') && (
                        <i className="fas fa-money-bill-wave fa-2x"></i>
                      )}
                      {metodo.nombre.toUpperCase().includes('TARJETA') && (
                        <i className="fas fa-credit-card fa-2x"></i>
                      )}
                      {metodo.nombre.toUpperCase().includes('TRANSFERENCIA') && (
                        <i className="fas fa-exchange-alt fa-2x"></i>
                      )}
                      {metodo.nombre.toUpperCase().includes('CRÉDITO') && (
                        <i className="fas fa-calendar-plus fa-2x"></i>
                      )}
                      {!['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CRÉDITO'].some(term => 
                        metodo.nombre.toUpperCase().includes(term)) && (
                        <i className="fas fa-credit-card fa-2x"></i>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Código SRI: {metodo.id_forma_pago}
                  </small>
                  <button className="btn btn-outline-warning btn-sm">
                    <i className="fas fa-check me-1"></i>
                    Seleccionar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay métodos disponibles */}
      {metodosPago.length === 0 && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow">
              <div className="card-body text-center py-5">
                <i className="fas fa-credit-card fa-5x text-muted mb-4"></i>
                <h3 className="text-muted">No hay métodos de pago disponibles</h3>
                <p className="text-muted mb-4">
                  El administrador aún no ha configurado métodos de pago activos
                </p>
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  Contacte al administrador del sistema para habilitar métodos de pago
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-info text-white">
              <h6 className="m-0 font-weight-bold">
                <i className="fas fa-info-circle me-2"></i>
                Información Importante
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary">
                    <i className="fas fa-shield-alt me-2"></i>
                    Seguridad
                  </h6>
                  <ul className="list-unstyled">
                    <li><i className="fas fa-check text-success me-2"></i> Todos los métodos están verificados</li>
                    <li><i className="fas fa-check text-success me-2"></i> Transacciones seguras garantizadas</li>
                    <li><i className="fas fa-check text-success me-2"></i> Protección de datos personales</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6 className="text-warning">
                    <i className="fas fa-question-circle me-2"></i>
                    Ayuda
                  </h6>
                  <ul className="list-unstyled">
                    <li><i className="fas fa-phone text-info me-2"></i> Soporte: +593 XX XXX XXXX</li>
                    <li><i className="fas fa-envelope text-info me-2"></i> Email: soporte@sistema.com</li>
                    <li><i className="fas fa-clock text-info me-2"></i> Horario: 24/7</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}
    </div>
  );
};

export default MetodosPagoCliente;