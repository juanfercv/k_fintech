import React, { useState, useEffect } from 'react';
import { tiendaService, type Tienda } from '../../services/api';

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
      const data = await tiendaService.getAll();
      setTiendas(data);
      if (data.length > 0) {
        setTiendaSeleccionada(data[0]); // Seleccionar la primera por defecto
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
      await tiendaService.create(formData);
      await cargarTiendas();
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
      await tiendaService.update(tiendaSeleccionada.idTienda, formData);
      await cargarTiendas();
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
      await tiendaService.delete(tiendaSeleccionada.idTienda);
      await cargarTiendas();
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
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid fade-in">
      {/* Mensajes */}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-gradient-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="mb-0">
                    <i className="fas fa-store me-3"></i>
                    Gestión de Tiendas
                  </h1>
                  <p className="mb-0 opacity-75">Administración completa de sus establecimientos</p>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-light"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Nueva Tienda
                  </button>
                  {tiendaSeleccionada && (
                    <button 
                      className="btn btn-warning"
                      onClick={openEditModal}
                    >
                      <i className="fas fa-edit me-2"></i>
                      Editar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
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
                    Con Dueño
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {tiendas.filter(t => t.dueñoTienda).length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-user-tie fa-2x text-gray-300"></i>
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
                    Con Email
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {tiendas.filter(t => t.correo_electronico_tienda).length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-envelope fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Con Teléfono
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {tiendas.filter(t => t.telefono).length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-phone fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Tiendas */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-info">
                <i className="fas fa-list me-2"></i>
                Listado de Tiendas ({tiendas.length})
              </h6>
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
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiendas.map((tienda) => (
                      <tr 
                        key={tienda.idTienda} 
                        className={`align-middle ${tiendaSeleccionada?.idTienda === tienda.idTienda ? 'table-active' : ''}`}
                        onClick={() => setTiendaSeleccionada(tienda)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>
                          <span className="badge bg-info">#{tienda.idTienda}</span>
                        </td>
                        <td>
                          <strong>{tienda.nombreTienda}</strong>
                        </td>
                        <td>
                          {tienda.dueñoTienda ? (
                            <span className="badge bg-success">{tienda.dueñoTienda}</span>
                          ) : (
                            <span className="text-muted">No asignado</span>
                          )}
                        </td>
                        <td>
                          <span className="badge bg-secondary">{tienda.RUCTienda}</span>
                        </td>
                        <td>
                          {tienda.correo_electronico_tienda ? (
                            <a href={`mailto:${tienda.correo_electronico_tienda}`} className="text-decoration-none">
                              <i className="fas fa-envelope me-1"></i>
                              {tienda.correo_electronico_tienda}
                            </a>
                          ) : (
                            <span className="text-muted">No registrado</span>
                          )}
                        </td>
                        <td>
                          {tienda.telefono ? (
                            <a href={`tel:${tienda.telefono}`} className="text-decoration-none">
                              <i className="fas fa-phone me-1"></i>
                              {tienda.telefono}
                            </a>
                          ) : (
                            <span className="text-muted">No registrado</span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-primary" 
                              title="Editar"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTiendaSeleccionada(tienda);
                                openEditModal();
                              }}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn btn-outline-danger" 
                              title="Eliminar"
                              onClick={(e) => {
                                e.stopPropagation();
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

      {/* Información Detallada de la Tienda Seleccionada */}
      {tiendaSeleccionada && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="m-0">
                    <i className="fas fa-store me-2"></i>
                    Detalles de: {tiendaSeleccionada.nombreTienda}
                  </h5>
                  <div className="badge bg-light text-dark">
                    ID: {tiendaSeleccionada.idTienda}
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-primary">
                      <i className="fas fa-id-card me-2"></i>
                      Información Fiscal
                    </h6>
                    <dl className="row">
                      <dt className="col-sm-4">RUC:</dt>
                      <dd className="col-sm-8">
                        <code className="bg-light px-2 py-1 rounded">
                          {tiendaSeleccionada.RUCTienda}
                        </code>
                      </dd>
                      
                      <dt className="col-sm-4">Dueño:</dt>
                      <dd className="col-sm-8">
                        <span className="badge bg-success">
                          {tiendaSeleccionada.dueñoTienda || 'No asignado'}
                        </span>
                      </dd>
                    </dl>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-info">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Direcciones
                    </h6>
                    <dl className="row">
                      <dt className="col-sm-4">Matriz:</dt>
                      <dd className="col-sm-8">
                        <small className="text-muted">
                          {tiendaSeleccionada.dirección_matriz_tienda || 'No registrada'}
                        </small>
                      </dd>
                      
                      <dt className="col-sm-4">Sucursal:</dt>
                      <dd className="col-sm-8">
                        <small className="text-muted">
                          {tiendaSeleccionada.direccion_sucursal_tienda || 'Misma que matriz'}
                        </small>
                      </dd>
                    </dl>
                  </div>
                </div>
                
                <hr/>
                
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-success">
                      <i className="fas fa-address-book me-2"></i>
                      Contacto
                    </h6>
                    <dl className="row">
                      {tiendaSeleccionada.telefono && (
                        <>
                          <dt className="col-sm-4">Teléfono:</dt>
                          <dd className="col-sm-8">
                            <a href={`tel:${tiendaSeleccionada.telefono}`} className="text-decoration-none">
                              <i className="fas fa-phone me-1"></i>
                              {tiendaSeleccionada.telefono}
                            </a>
                          </dd>
                        </>
                      )}
                      
                      {tiendaSeleccionada.correo_electronico_tienda && (
                        <>
                          <dt className="col-sm-4">Email:</dt>
                          <dd className="col-sm-8">
                            <a 
                              href={`mailto:${tiendaSeleccionada.correo_electronico_tienda}`} 
                              className="text-decoration-none"
                            >
                              <i className="fas fa-envelope me-1"></i>
                              {tiendaSeleccionada.correo_electronico_tienda}
                            </a>
                          </dd>
                        </>
                      )}
                    </dl>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-warning">
                      <i className="fas fa-cog me-2"></i>
                      Acciones Rápidas
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={openEditModal}
                      >
                        <i className="fas fa-edit me-1"></i>
                        Editar Tienda
                      </button>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleDelete}
                      >
                        <i className="fas fa-trash me-1"></i>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Creación */}
      {showCreateModal && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="fas fa-store me-2"></i>
                  Registrar Nueva Tienda
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
                      <label className="form-label">Nombre Comercial *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.nombreTienda}
                        onChange={(e) => setFormData({...formData, nombreTienda: e.target.value})}
                        required
                        placeholder="Nombre de la tienda"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Dueño</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.dueñoTienda}
                        onChange={(e) => setFormData({...formData, dueñoTienda: e.target.value})}
                        placeholder="Nombre del dueño"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">RUC *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.RUCTienda}
                        onChange={(e) => setFormData({...formData, RUCTienda: e.target.value})}
                        required
                        placeholder="RUC de la empresa"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Teléfono</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.telefono}
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                        placeholder="Teléfono de contacto"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.correo_electronico_tienda}
                        onChange={(e) => setFormData({...formData, correo_electronico_tienda: e.target.value})}
                        placeholder="Email de contacto"
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Dirección Matriz</label>
                      <textarea
                        className="form-control"
                        value={formData.dirección_matriz_tienda}
                        onChange={(e) => setFormData({...formData, dirección_matriz_tienda: e.target.value})}
                        rows={2}
                        placeholder="Dirección matriz de la empresa"
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Dirección Sucursal</label>
                      <textarea
                        className="form-control"
                        value={formData.direccion_sucursal_tienda}
                        onChange={(e) => setFormData({...formData, direccion_sucursal_tienda: e.target.value})}
                        rows={2}
                        placeholder="Dirección de la sucursal"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-success">
                      <i className="fas fa-save me-2"></i>
                      Registrar Tienda
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
                      <label className="form-label">Nombre Comercial *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.nombreTienda}
                        onChange={(e) => setFormData({...formData, nombreTienda: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Dueño</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.dueñoTienda}
                        onChange={(e) => setFormData({...formData, dueñoTienda: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">RUC *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.RUCTienda}
                        onChange={(e) => setFormData({...formData, RUCTienda: e.target.value})}
                        required
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
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.correo_electronico_tienda}
                        onChange={(e) => setFormData({...formData, correo_electronico_tienda: e.target.value})}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Dirección Matriz</label>
                      <textarea
                        className="form-control"
                        value={formData.dirección_matriz_tienda}
                        onChange={(e) => setFormData({...formData, dirección_matriz_tienda: e.target.value})}
                        rows={2}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Dirección Sucursal</label>
                      <textarea
                        className="form-control"
                        value={formData.direccion_sucursal_tienda}
                        onChange={(e) => setFormData({...formData, direccion_sucursal_tienda: e.target.value})}
                        rows={2}
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
    </div>
  );
};

export default TiendaCliente;