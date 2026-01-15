import React, { useState, useEffect } from 'react';

interface Tienda {
  idTienda: number;
  nombreTienda: string;
  dueñoTienda?: string;
  RUCTienda?: string;
  dirección_matriz_tienda?: string;
  direccion_sucursal_tienda?: string;
  correo_electronico_tienda?: string;
  telefono?: string;
  estado?: 'ACTIVA' | 'INACTIVA';
  fecha_creacion?: string;
}

const TiendaCliente: React.FC = () => {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState<Tienda | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estados para formularios
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Estado para formulario
  const [formData, setFormData] = useState({
    nombreTienda: '',
    dueñoTienda: '',
    RUCTienda: '',
    dirección_matriz_tienda: '',
    direccion_sucursal_tienda: '',
    correo_electronico_tienda: '',
    telefono: ''
  });

  const cargarTiendas = async () => {
    try {
      setLoading(true);
      
      // Datos mockeados para demostración
      const mockData: Tienda[] = [
        {
          idTienda: 1,
          nombreTienda: 'Tienda Principal Quito',
          dueñoTienda: 'Carlos Ramírez',
          RUCTienda: '1790012345001',
          dirección_matriz_tienda: 'Av. Amazonas N24-567, Quito',
          direccion_sucursal_tienda: 'Av. 6 de Diciembre N34-123, Quito',
          correo_electronico_tienda: 'quito@k-fintech.com',
          telefono: '02-2564897',
          estado: 'ACTIVA',
          fecha_creacion: '2024-01-15'
        },
        {
          idTienda: 2,
          nombreTienda: 'Tienda Guayaquil',
          dueñoTienda: 'María Fernández',
          RUCTienda: '1790098765001',
          dirección_matriz_tienda: 'Av. 9 de Octubre S12-45, Guayaquil',
          direccion_sucursal_tienda: 'Urbanización Kennedy, Guayaquil',
          correo_electronico_tienda: 'guayaquil@k-fintech.com',
          telefono: '04-2345678',
          estado: 'ACTIVA',
          fecha_creacion: '2024-01-20'
        },
        {
          idTienda: 3,
          nombreTienda: 'Tienda Cuenca',
          dueñoTienda: 'José Coro',
          RUCTienda: '1790045678001',
          dirección_matriz_tienda: 'Calle Larga 123, Cuenca',
          correo_electronico_tienda: 'cuenca@k-fintech.com',
          telefono: '07-2876543',
          estado: 'INACTIVA',
          fecha_creacion: '2024-01-10'
        }
      ];
      
      setTiendas(mockData);
      if (mockData.length > 0) {
        setTiendaSeleccionada(mockData[0]); // Seleccionar la primera por defecto
      }
    } catch (err) {
      setError('Error al cargar tiendas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTiendas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulación de creación
      const nuevaTienda: Tienda = {
        idTienda: Math.max(...tiendas.map(t => t.idTienda)) + 1,
        ...formData,
        estado: 'ACTIVA',
        fecha_creacion: new Date().toISOString().split('T')[0]
      };
      
      setTiendas([...tiendas, nuevaTienda]);
      setShowCreateModal(false);
      setSuccess('Tienda creada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
      resetForm();
    } catch (err) {
      setError('Error al crear tienda');
      console.error(err);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tiendaSeleccionada) return;
    
    try {
      setTiendas(tiendas.map(tienda => 
        tienda.idTienda === tiendaSeleccionada.idTienda 
          ? {...tienda, ...formData}
          : tienda
      ));
      setShowEditModal(false);
      setSuccess('Tienda actualizada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error al actualizar tienda');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!tiendaSeleccionada) return;
    
    if (!window.confirm('¿Está seguro de eliminar esta tienda? Esta acción no se puede deshacer.')) return;
    
    try {
      setTiendas(tiendas.filter(t => t.idTienda !== tiendaSeleccionada.idTienda));
      setTiendaSeleccionada(null);
      setSuccess('Tienda eliminada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error al eliminar tienda');
      console.error(err);
    }
  };

  const openEditModal = () => {
    if (!tiendaSeleccionada) return;
    
    setFormData({
      nombreTienda: tiendaSeleccionada.nombreTienda,
      dueñoTienda: tiendaSeleccionada.dueñoTienda || '',
      RUCTienda: tiendaSeleccionada.RUCTienda || '',
      dirección_matriz_tienda: tiendaSeleccionada.dirección_matriz_tienda || '',
      direccion_sucursal_tienda: tiendaSeleccionada.direccion_sucursal_tienda || '',
      correo_electronico_tienda: tiendaSeleccionada.correo_electronico_tienda || '',
      telefono: tiendaSeleccionada.telefono || ''
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      nombreTienda: '',
      dueñoTienda: '',
      RUCTienda: '',
      dirección_matriz_tienda: '',
      direccion_sucursal_tienda: '',
      correo_electronico_tienda: '',
      telefono: ''
    });
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando información de tiendas...</p>
        </div>
      </div>
    );
  }

  const tiendasActivas = tiendas.filter(t => t.estado === 'ACTIVA');
  const tiendasConContacto = tiendas.filter(t => t.correo_electronico_tienda || t.telefono);

  return (
    <div className="container-fluid">
      {/* Mensajes */}
      {success && (
        <div className="alert alert-success alert-dismissible fade show">
          <i className="fas fa-check-circle me-2"></i>
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-gradient-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="mb-0">
                    <i className="fas fa-store me-3"></i>
                    Información de Tiendas
                  </h1>
                  <p className="mb-0 opacity-75">Listado completo de establecimientos disponibles</p>
                </div>
                <div className="text-end">
                  <div className="h5 mb-0">
                    <span className="badge bg-light text-dark">
                      <i className="fas fa-store me-1"></i>
                      {tiendasActivas.length} activas
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
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Tiendas
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {tiendas.length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-store fa-2x text-gray-300"></i>
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
                    Activas
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {tiendasActivas.length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-check-circle fa-2x text-gray-300"></i>
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
                    Con Contacto
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {tiendasConContacto.length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-phone fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Inactivas
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {tiendas.filter(t => t.estado === 'INACTIVA').length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-times-circle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Tiendas */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-list me-2"></i>
                Listado de Tiendas ({tiendas.length})
              </h6>
              <button 
                className="btn btn-success btn-sm"
                onClick={() => setShowCreateModal(true)}
              >
                <i className="fas fa-plus me-2"></i>
                Nueva Tienda
              </button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Dueño</th>
                      <th>RUC</th>
                      <th>Dirección</th>
                      <th>Contacto</th>
                      <th>Estado</th>
                      <th>Fecha Creación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiendas.map((tienda) => (
                      <tr key={tienda.idTienda} className="align-middle">
                        <td>
                          <span className="badge bg-info">#{tienda.idTienda}</span>
                        </td>
                        <td>
                          <span className="font-weight-bold">{tienda.nombreTienda}</span>
                        </td>
                        <td>{tienda.dueñoTienda || 'N/A'}</td>
                        <td>{tienda.RUCTienda || 'N/A'}</td>
                        <td>
                          <small>
                            {tienda.dirección_matriz_tienda || 'N/A'}
                            {tienda.direccion_sucursal_tienda && (
                              <div className="text-muted">
                                Sucursal: {tienda.direccion_sucursal_tienda}
                              </div>
                            )}
                          </small>
                        </td>
                        <td>
                          {tienda.correo_electronico_tienda && (
                            <div>
                              <i className="fas fa-envelope text-primary me-1"></i>
                              {tienda.correo_electronico_tienda}
                            </div>
                          )}
                          {tienda.telefono && (
                            <div>
                              <i className="fas fa-phone text-success me-1"></i>
                              {tienda.telefono}
                            </div>
                          )}
                          {!tienda.correo_electronico_tienda && !tienda.telefono && (
                            <span className="text-muted">Sin contacto</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge rounded-pill ${
                            tienda.estado === 'ACTIVA' ? 'bg-success' : 'bg-danger'
                          }`}>
                            {tienda.estado}
                          </span>
                        </td>
                        <td>{tienda.fecha_creacion || 'N/A'}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              title="Ver Detalle"
                              onClick={() => setTiendaSeleccionada(tienda)}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              className="btn btn-outline-warning"
                              title="Editar"
                              onClick={() => {
                                setTiendaSeleccionada(tienda);
                                openEditModal();
                              }}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              title="Eliminar"
                              onClick={() => {
                                setTiendaSeleccionada(tienda);
                                handleDelete();
                              }}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Creación */}
      {showCreateModal && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="fas fa-plus-circle me-2"></i>
                  Crear Nueva Tienda
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre de la Tienda *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.nombreTienda}
                        onChange={(e) => setFormData({...formData, nombreTienda: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Dueño de la Tienda</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.dueñoTienda}
                        onChange={(e) => setFormData({...formData, dueñoTienda: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">RUC</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.RUCTienda}
                        onChange={(e) => setFormData({...formData, RUCTienda: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Teléfono</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.telefono}
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Dirección Matriz</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.dirección_matriz_tienda}
                        onChange={(e) => setFormData({...formData, dirección_matriz_tienda: e.target.value})}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Dirección Sucursal</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.direccion_sucursal_tienda}
                        onChange={(e) => setFormData({...formData, direccion_sucursal_tienda: e.target.value})}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Correo Electrónico</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.correo_electronico_tienda}
                        onChange={(e) => setFormData({...formData, correo_electronico_tienda: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-success">
                      <i className="fas fa-save me-2"></i>
                      Crear Tienda
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {showEditModal && tiendaSeleccionada && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-warning text-white">
                <h5 className="modal-title">
                  <i className="fas fa-edit me-2"></i>
                  Editar Tienda #{tiendaSeleccionada.idTienda}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEdit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre de la Tienda *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.nombreTienda}
                        onChange={(e) => setFormData({...formData, nombreTienda: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Dueño de la Tienda</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.dueñoTienda}
                        onChange={(e) => setFormData({...formData, dueñoTienda: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">RUC</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.RUCTienda}
                        onChange={(e) => setFormData({...formData, RUCTienda: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Teléfono</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.telefono}
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Dirección Matriz</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.dirección_matriz_tienda}
                        onChange={(e) => setFormData({...formData, dirección_matriz_tienda: e.target.value})}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Dirección Sucursal</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.direccion_sucursal_tienda}
                        onChange={(e) => setFormData({...formData, direccion_sucursal_tienda: e.target.value})}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Correo Electrónico</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.correo_electronico_tienda}
                        onChange={(e) => setFormData({...formData, correo_electronico_tienda: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-warning">
                      <i className="fas fa-save me-2"></i>
                      Actualizar Tienda
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalle */}
      {tiendaSeleccionada && !showEditModal && !showCreateModal && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title">
                  <i className="fas fa-store me-2"></i>
                  Detalle de Tienda #{tiendaSeleccionada.idTienda}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setTiendaSeleccionada(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold">Información General</h6>
                    <p><strong>Nombre:</strong> {tiendaSeleccionada.nombreTienda}</p>
                    <p><strong>Dueño:</strong> {tiendaSeleccionada.dueñoTienda || 'N/A'}</p>
                    <p><strong>RUC:</strong> {tiendaSeleccionada.RUCTienda || 'N/A'}</p>
                    <p><strong>Estado:</strong> 
                      <span className={`badge ms-2 ${
                        tiendaSeleccionada.estado === 'ACTIVA' ? 'bg-success' : 'bg-danger'
                      }`}>
                        {tiendaSeleccionada.estado}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold">Contacto y Dirección</h6>
                    <p><strong>Dirección Matriz:</strong> {tiendaSeleccionada.dirección_matriz_tienda || 'N/A'}</p>
                    {tiendaSeleccionada.direccion_sucursal_tienda && (
                      <p><strong>Dirección Sucursal:</strong> {tiendaSeleccionada.direccion_sucursal_tienda}</p>
                    )}
                    <p><strong>Email:</strong> {tiendaSeleccionada.correo_electronico_tienda || 'N/A'}</p>
                    <p><strong>Teléfono:</strong> {tiendaSeleccionada.telefono || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setTiendaSeleccionada(null)}>
                  Cerrar
                </button>
                <button 
                  className="btn btn-warning"
                  onClick={() => {
                    openEditModal();
                  }}
                >
                  <i className="fas fa-edit me-2"></i>
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiendaCliente;