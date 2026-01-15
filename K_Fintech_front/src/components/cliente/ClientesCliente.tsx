import React, { useState, useEffect } from 'react';
import { clienteService, type Cliente } from '../../services/api';

const ClientesCliente: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [busqueda, setBusqueda] = useState('');

  // Formulario
  const [formData, setFormData] = useState({
    nombre_cliente: '',
    cedula_cliente: '',
    direccion_cliente: '',
    celular_cliente: '',
    correo_cliente: ''
  });

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await clienteService.getAll();
      setClientes(data);
    } catch (err) {
      setError('Error al cargar clientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCliente) {
        await clienteService.update(editingCliente.id_cliente, formData);
      } else {
        await clienteService.create(formData);
      }
      await cargarClientes();
      handleCloseForm();
    } catch (err) {
      setError('Error al guardar cliente');
      console.error(err);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nombre_cliente: cliente.nombre_cliente,
      cedula_cliente: cliente.cedula_cliente,
      direccion_cliente: cliente.direccion_cliente,
      celular_cliente: cliente.celular_cliente,
      correo_cliente: cliente.correo_cliente
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        await clienteService.delete(id);
        await cargarClientes();
      } catch (err) {
        setError('Error al eliminar cliente');
        console.error(err);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCliente(null);
    setFormData({
      nombre_cliente: '',
      cedula_cliente: '',
      direccion_cliente: '',
      celular_cliente: '',
      correo_cliente: ''
    });
  };

  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nombre_cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.cedula_cliente.includes(busqueda) ||
    cliente.correo_cliente?.toLowerCase().includes(busqueda.toLowerCase())
  );

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
          <div className="card bg-gradient-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="mb-0">
                    <i className="fas fa-users me-3"></i>
                    Gestión de Clientes
                  </h1>
                  <p className="mb-0 opacity-75">Registro y administración de clientes</p>
                </div>
                <button 
                  className="btn btn-light btn-lg"
                  onClick={() => setShowForm(true)}
                >
                  <i className="fas fa-plus me-2"></i>
                  Nuevo Cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Total Clientes
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {clientes.length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-2x text-gray-300"></i>
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
                    Con Email
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {clientes.filter(c => c.correo_cliente).length}
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
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Con Teléfono
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {clientes.filter(c => c.celular_cliente).length}
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
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Recientes
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {clientes.slice(0, 5).length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-clock fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre, cédula o email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listado de Clientes */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-success">
                <i className="fas fa-list me-2"></i>
                Listado de Clientes ({clientesFiltrados.length})
              </h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>ID</th>
                      <th>Nombre Completo</th>
                      <th>Cédula/RUC</th>
                      <th>Contacto</th>
                      <th>Dirección</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesFiltrados.map((cliente) => (
                      <tr key={cliente.id_cliente} className="align-middle">
                        <td>
                          <span className="badge bg-success">#{cliente.id_cliente}</span>
                        </td>
                        <td>
                          <strong className="text-dark">{cliente.nombre_cliente}</strong>
                        </td>
                        <td>
                          <code className="bg-light px-2 py-1 rounded">
                            {cliente.cedula_cliente}
                          </code>
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            {cliente.celular_cliente && (
                              <small>
                                <i className="fas fa-mobile-alt me-1 text-primary"></i>
                                {cliente.celular_cliente}
                              </small>
                            )}
                            {cliente.correo_cliente && (
                              <small>
                                <i className="fas fa-envelope me-1 text-info"></i>
                                {cliente.correo_cliente}
                              </small>
                            )}
                          </div>
                        </td>
                        <td>
                          <small className="text-muted">
                            {cliente.direccion_cliente.substring(0, 40)}...
                          </small>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-primary" 
                              title="Editar"
                              onClick={() => handleEdit(cliente)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn btn-outline-info" 
                              title="Ver Historial"
                            >
                              <i className="fas fa-history"></i>
                            </button>
                            <button 
                              className="btn btn-outline-success" 
                              title="Crear Factura"
                            >
                              <i className="fas fa-file-invoice"></i>
                            </button>
                            <button 
                              className="btn btn-outline-danger" 
                              title="Eliminar"
                              onClick={() => handleDelete(cliente.id_cliente)}
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

              {clientesFiltrados.length === 0 && (
                <div className="text-center py-5">
                  <i className="fas fa-users fa-5x text-muted mb-4"></i>
                  <h3 className="text-muted">No se encontraron clientes</h3>
                  <p className="text-muted mb-4">
                    {busqueda ? 'Intente con otros términos de búsqueda' : 'Comience registrando su primer cliente'}
                  </p>
                  {!busqueda && (
                    <button 
                      className="btn btn-success btn-lg"
                      onClick={() => setShowForm(true)}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Registrar Nuevo Cliente
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Formulario */}
      {showForm && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="fas fa-user me-2"></i>
                  {editingCliente ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseForm}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Nombre Completo *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ingrese nombre completo"
                          value={formData.nombre_cliente}
                          onChange={(e) => setFormData({...formData, nombre_cliente: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Cédula/RUC *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ingrese cédula o RUC"
                          value={formData.cedula_cliente}
                          onChange={(e) => setFormData({...formData, cedula_cliente: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <textarea
                      className="form-control"
                      placeholder="Ingrese dirección completa"
                      rows={3}
                      value={formData.direccion_cliente}
                      onChange={(e) => setFormData({...formData, direccion_cliente: e.target.value})}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Teléfono Celular</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="Ingrese número de teléfono"
                          value={formData.celular_cliente}
                          onChange={(e) => setFormData({...formData, celular_cliente: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Correo Electrónico</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Ingrese correo electrónico"
                          value={formData.correo_cliente}
                          onChange={(e) => setFormData({...formData, correo_cliente: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={handleCloseForm}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-success"
                    >
                      <i className="fas fa-save me-2"></i>
                      {editingCliente ? 'Actualizar' : 'Registrar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default ClientesCliente;