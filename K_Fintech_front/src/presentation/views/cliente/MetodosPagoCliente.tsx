import React, { useState, useEffect } from 'react';

interface MetodoPago {
  id_forma_pago: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  codigo_sri?: string;
  tipo?: 'INSTANTANEO' | 'DIFERIDO';
  icono?: string;
}

const MetodosPagoCliente: React.FC = () => {
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<number | null>(null);

  const cargarMetodosPago = async () => {
    try {
      setLoading(true);
      
      // Datos mockeados para demostración
      const mockData: MetodoPago[] = [
        {
          id_forma_pago: 1,
          nombre: 'Efectivo',
          descripcion: 'Pago en efectivo directo',
          activo: true,
          codigo_sri: '01',
          tipo: 'INSTANTANEO',
          icono: 'money-bill-wave'
        },
        {
          id_forma_pago: 2,
          nombre: 'Tarjeta de Crédito',
          descripcion: 'Pago con tarjeta de crédito Visa/Mastercard',
          activo: true,
          codigo_sri: '02',
          tipo: 'DIFERIDO',
          icono: 'credit-card'
        },
        {
          id_forma_pago: 3,
          nombre: 'Tarjeta de Débito',
          descripcion: 'Pago con tarjeta de débito',
          activo: true,
          codigo_sri: '03',
          tipo: 'INSTANTANEO',
          icono: 'credit-card'
        },
        {
          id_forma_pago: 4,
          nombre: 'Transferencia Bancaria',
          descripcion: 'Transferencia electrónica entre cuentas',
          activo: true,
          codigo_sri: '04',
          tipo: 'INSTANTANEO',
          icono: 'exchange-alt'
        },
        {
          id_forma_pago: 5,
          nombre: 'Crédito Empresarial',
          descripcion: 'Pago a crédito con condiciones especiales',
          activo: true,
          codigo_sri: '05',
          tipo: 'DIFERIDO',
          icono: 'calendar-plus'
        },
        {
          id_forma_pago: 6,
          nombre: 'Cheque',
          descripcion: 'Pago mediante cheque bancario',
          activo: false,
          codigo_sri: '06',
          tipo: 'INSTANTANEO',
          icono: 'money-check'
        }
      ];
      
      setMetodosPago(mockData);
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

  const handleSeleccionarMetodo = (id: number) => {
    setMetodoSeleccionado(id === metodoSeleccionado ? null : id);
  };

  const handleActivarMetodo = async (id: number) => {
    try {
      setMetodosPago(metodosPago.map(metodo => 
        metodo.id_forma_pago === id 
          ? {...metodo, activo: !metodo.activo}
          : metodo
      ));
    } catch (err) {
      setError('Error al cambiar estado del método');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando métodos de pago...</p>
        </div>
      </div>
    );
  }

  const metodosActivos = metodosPago.filter(m => m.activo);
  const metodosInstantaneos = metodosActivos.filter(m => m.tipo === 'INSTANTANEO');
  const metodosDiferidos = metodosActivos.filter(m => m.tipo === 'DIFERIDO');

  return (
    <div className="container-fluid">
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
                  <p className="mb-0 opacity-75">Formas de pago configuradas por el administrador</p>
                </div>
                <div className="text-end">
                  <div className="h5 mb-0">
                    <span className="badge bg-light text-dark">
                      <i className="fas fa-check-circle me-1"></i>
                      {metodosActivos.length} activos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Métodos Activos
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {metodosActivos.length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-credit-card fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Pagos Instantáneos
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {metodosInstantaneos.length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-bolt fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Pagos Diferidos
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {metodosDiferidos.length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-secondary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                    Total Configurados
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {metodosPago.length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-list fa-2x text-gray-300"></i>
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
            <div className={`card shadow h-100 border-left-${metodo.activo ? 'warning' : 'secondary'}`}>
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-3">
                    <div className={`text-xs font-weight-bold text-${metodo.activo ? 'warning' : 'secondary'} text-uppercase mb-1`}>
                      {metodo.nombre}
                    </div>
                    <div className="h5 mb-2 font-weight-bold text-gray-800">
                      {metodo.descripcion}
                    </div>
                    <div className="mb-2">
                      <span className={`badge ${metodo.activo ? 'bg-success' : 'bg-secondary'}`}>
                        <i className={`fas ${metodo.activo ? 'fa-check' : 'fa-times'} me-1`}></i>
                        {metodo.activo ? 'Activo' : 'Inactivo'}
                      </span>
                      {metodo.tipo === 'DIFERIDO' && (
                        <span className="badge bg-info ms-1">
                          <i className="fas fa-clock me-1"></i>
                          Diferido
                        </span>
                      )}
                      {metodo.tipo === 'INSTANTANEO' && (
                        <span className="badge bg-success ms-1">
                          <i className="fas fa-bolt me-1"></i>
                          Instantáneo
                        </span>
                      )}
                    </div>
                    <div className="small text-muted">
                      <i className="fas fa-barcode me-1"></i>
                      Código SRI: {metodo.codigo_sri || 'N/A'}
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className={`icon-circle bg-${metodo.activo ? 'warning' : 'secondary'} text-white`}>
                      <i className={`fas fa-${metodo.icono || 'credit-card'} fa-2x`}></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <button 
                    className={`btn btn-sm ${metodoSeleccionado === metodo.id_forma_pago ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={() => handleSeleccionarMetodo(metodo.id_forma_pago)}
                    disabled={!metodo.activo}
                  >
                    <i className={`fas ${metodoSeleccionado === metodo.id_forma_pago ? 'fa-check-circle' : 'fa-circle'} me-1`}></i>
                    {metodoSeleccionado === metodo.id_forma_pago ? 'Seleccionado' : 'Seleccionar'}
                  </button>
                  <button 
                    className={`btn btn-sm ${metodo.activo ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                    onClick={() => handleActivarMetodo(metodo.id_forma_pago)}
                  >
                    <i className={`fas ${metodo.activo ? 'fa-toggle-on' : 'fa-toggle-off'} me-1`}></i>
                    {metodo.activo ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay métodos disponibles */}
      {metodosActivos.length === 0 && (
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
                    <li><i className="fas fa-envelope text-info me-2"></i> Email: soporte@k-fintech.com</li>
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