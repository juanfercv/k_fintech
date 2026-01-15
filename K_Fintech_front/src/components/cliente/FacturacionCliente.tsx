import React, { useState, useEffect } from 'react';
import { tiendaService, clienteService, metodoPagoService, facturaService, type Tienda, type Cliente, type MetodoPago, type Factura } from '../../services/api';
import '../../../shared/styles/cliente-profesional.css';

const FacturacionCliente: React.FC = () => {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busquedaCliente, setBusquedaCliente] = useState('');

  // Formulario de nueva factura
  const [formData, setFormData] = useState({
    idTienda: 0,
    idCliente: 0,
    idFormaPago: 0,
    fecha_emision: new Date().toISOString().split('T')[0],
    detalle: '',
    total: 0
  });

  // Productos/servicios
  const [productos, setProductos] = useState<Array<{descripcion: string, cantidad: number, precio: number}>>([
    { descripcion: '', cantidad: 1, precio: 0 }
  ]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [tiendasData, clientesData, metodosData, facturasData] = await Promise.all([
        tiendaService.getAll(),
        clienteService.getAll(),
        metodoPagoService.getActive(),
        facturaService.getAll()
      ]);
      
      setTiendas(tiendasData);
      setClientes(clientesData);
      setMetodosPago(metodosData);
      setFacturas(facturasData);
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const calcularTotal = () => {
    return productos.reduce((sum, prod) => sum + (prod.cantidad * prod.precio), 0);
  };

  const agregarProducto = () => {
    setProductos([...productos, { descripcion: '', cantidad: 1, precio: 0 }]);
  };

  const eliminarProducto = (index: number) => {
    if (productos.length > 1) {
      const nuevosProductos = [...productos];
      nuevosProductos.splice(index, 1);
      setProductos(nuevosProductos);
    }
  };

  const actualizarProducto = (index: number, campo: string, valor: string | number) => {
    const nuevosProductos = [...productos];
    nuevosProductos[index] = { ...nuevosProductos[index], [campo]: valor };
    setProductos(nuevosProductos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nuevaFactura = {
        ...formData,
        total: calcularTotal(),
        detalle: JSON.stringify(productos),
        estado_factura: 'Pendiente'
      };
      
      await facturaService.create(nuevaFactura);
      await cargarDatos();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError('Error al crear factura');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      idTienda: 0,
      idCliente: 0,
      idFormaPago: 0,
      fecha_emision: new Date().toISOString().split('T')[0],
      detalle: '',
      total: 0
    });
    setProductos([{ descripcion: '', cantidad: 1, precio: 0 }]);
  };

  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nombre_cliente.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
    cliente.cedula_cliente.includes(busquedaCliente)
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
    <div className="container-fluid fade-in-up">
      {/* Header con diseño mejorado */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="card-body text-center py-5" style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)', color: 'white' }}>
              <div className="bounce-in">
                <div className="mb-4">
                  <div className="icon-circle bg-white text-primary mx-auto" style={{ width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-file-invoice fa-2x"></i>
                  </div>
                </div>
                <h1 className="display-4 fw-bold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Facturación Electrónica
                </h1>
                <p className="lead opacity-75 mb-4" style={{ fontSize: '1.2rem' }}>
                  Sistema avanzado de emisión de facturas electrónicas
                </p>
                <button 
                  className="btn btn-light btn-lg px-4 py-3 shadow-lg"
                  onClick={() => setShowForm(true)}
                  style={{ borderRadius: '50px', fontWeight: '600', letterSpacing: '1px' }}
                >
                  <i className="fas fa-plus me-2"></i>
                  Crear Nueva Factura
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas mejoradas */}
      <div className="row mb-5">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="stat-card slide-in-left" style={{ animationDelay: '0.1s' }}>
            <div className="icon-circle bg-primary text-white mx-auto mb-3" style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-file-invoice fa-lg"></i>
            </div>
            <div className="stat-number text-primary">{facturas.length}</div>
            <div className="stat-label">Total Facturas</div>
            <div className="progress mt-3" style={{ height: '5px' }}>
              <div className="progress-bar bg-primary" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="stat-card slide-in-left" style={{ animationDelay: '0.2s' }}>
            <div className="icon-circle bg-success text-white mx-auto mb-3" style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-check-circle fa-lg"></i>
            </div>
            <div className="stat-number text-success">{facturas.filter(f => f.estado_factura === 'Pagada').length}</div>
            <div className="stat-label">Pagadas</div>
            <div className="progress mt-3" style={{ height: '5px' }}>
              <div className="progress-bar bg-success" style={{ width: `${(facturas.filter(f => f.estado_factura === 'Pagada').length / Math.max(facturas.length, 1)) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="stat-card slide-in-left" style={{ animationDelay: '0.3s' }}>
            <div className="icon-circle bg-warning text-white mx-auto mb-3" style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-clock fa-lg"></i>
            </div>
            <div className="stat-number text-warning">{facturas.filter(f => f.estado_factura === 'Pendiente').length}</div>
            <div className="stat-label">Pendientes</div>
            <div className="progress mt-3" style={{ height: '5px' }}>
              <div className="progress-bar bg-warning" style={{ width: `${(facturas.filter(f => f.estado_factura === 'Pendiente').length / Math.max(facturas.length, 1)) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="stat-card slide-in-left" style={{ animationDelay: '0.4s' }}>
            <div className="icon-circle bg-info text-white mx-auto mb-3" style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-dollar-sign fa-lg"></i>
            </div>
            <div className="stat-number text-info">${facturas.reduce((sum, f) => sum + f.total, 0).toFixed(2)}</div>
            <div className="stat-label">Total Facturado</div>
            <div className="progress mt-3" style={{ height: '5px' }}>
              <div className="progress-bar bg-info" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Listado de Facturas */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-list me-2"></i>
                Listado de Facturas ({facturas.length})
              </h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>Número</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Método Pago</th>
                      <th>Estado</th>
                      <th>Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facturas.map((factura) => (
                      <tr key={factura.idFactura} className="align-middle">
                        <td>
                          <span className="badge bg-primary">F-{factura.idFactura.toString().padStart(6, '0')}</span>
                        </td>
                        <td>{new Date(factura.fecha_emision).toLocaleDateString()}</td>
                        <td>
                          <span className="badge bg-secondary">Cliente #{factura.idCliente}</span>
                        </td>
                        <td>
                          <span className="badge bg-info">Método #{factura.idFormaPago}</span>
                        </td>
                        <td>
                          <span className={`badge rounded-pill ${
                            factura.estado_factura === 'Pagada' ? 'bg-success' :
                            factura.estado_factura === 'Pendiente' ? 'bg-warning' : 'bg-danger'
                          }`}>
                            {factura.estado_factura}
                          </span>
                        </td>
                        <td>
                          <strong className="text-success">${factura.total.toFixed(2)}</strong>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary" title="Ver Detalle">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button className="btn btn-outline-success" title="Descargar PDF">
                              <i className="fas fa-file-pdf"></i>
                            </button>
                            <button className="btn btn-outline-info" title="Enviar por Email">
                              <i className="fas fa-paper-plane"></i>
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

      {/* Modal de Nueva Factura - Diseño Premium */}
      {showForm && (
        <div className="modal show d-block fade-in-up" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="modal-header" style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)', color: 'white', padding: '1.5rem' }}>
                <div className="d-flex align-items-center">
                  <div className="icon-circle bg-white text-primary me-3" style={{ width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-file-invoice"></i>
                  </div>
                  <div>
                    <h4 className="modal-title fw-bold mb-0">Crear Nueva Factura</h4>
                    <small className="opacity-75">Complete todos los campos requeridos</small>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowForm(false)}
                  style={{ filter: 'invert(1)' }}
                ></button>
              </div>
              <div className="modal-body" style={{ padding: '2rem' }}>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-4">
                        <label className="form-label fw-bold text-primary">
                          <i className="fas fa-store me-2"></i>
                          Tienda *
                        </label>
                        <select
                          className="form-control form-control-lg"
                          value={formData.idTienda}
                          onChange={(e) => setFormData({...formData, idTienda: parseInt(e.target.value)})}
                          required
                          style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                        >
                          <option value="">Seleccione una tienda</option>
                          {tiendas.map(tienda => (
                            <option key={tienda.idTienda} value={tienda.idTienda}>
                              {tienda.nombreTienda}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-4">
                        <label className="form-label fw-bold text-primary">
                          <i className="fas fa-user me-2"></i>
                          Cliente *
                        </label>
                        <select
                          className="form-control form-control-lg"
                          value={formData.idCliente}
                          onChange={(e) => setFormData({...formData, idCliente: parseInt(e.target.value)})}
                          required
                          style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                        >
                          <option value="">Seleccione un cliente</option>
                          {clientesFiltrados.map(cliente => (
                            <option key={cliente.id_cliente} value={cliente.id_cliente}>
                              {cliente.nombre_cliente} - {cliente.cedula_cliente}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-4">
                        <label className="form-label fw-bold text-primary">
                          <i className="fas fa-credit-card me-2"></i>
                          Método de Pago *
                        </label>
                        <select
                          className="form-control form-control-lg"
                          value={formData.idFormaPago}
                          onChange={(e) => setFormData({...formData, idFormaPago: parseInt(e.target.value)})}
                          required
                          style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                        >
                          <option value="">Seleccione método de pago</option>
                          {metodosPago.map(metodo => (
                            <option key={metodo.id_forma_pago} value={metodo.id_forma_pago}>
                              {metodo.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Buscar Cliente por Nombre o Cédula</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ingrese nombre o cédula del cliente"
                      value={busquedaCliente}
                      onChange={(e) => setBusquedaCliente(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Productos/Servicios</label>
                    {productos.map((producto, index) => (
                      <div key={index} className="row mb-2">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Descripción del producto/servicio"
                            value={producto.descripcion}
                            onChange={(e) => actualizarProducto(index, 'descripcion', e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-2">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Cantidad"
                            min="1"
                            value={producto.cantidad}
                            onChange={(e) => actualizarProducto(index, 'cantidad', parseInt(e.target.value) || 0)}
                            required
                          />
                        </div>
                        <div className="col-md-3">
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Precio"
                              min="0"
                              step="0.01"
                              value={producto.precio}
                              onChange={(e) => actualizarProducto(index, 'precio', parseFloat(e.target.value) || 0)}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-1">
                          {productos.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => eliminarProducto(index)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={agregarProducto}
                    >
                      <i className="fas fa-plus me-1"></i>
                      Agregar Producto
                    </button>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Fecha de Emisión</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.fecha_emision}
                          onChange={(e) => setFormData({...formData, fecha_emision: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Total</label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input
                            type="text"
                            className="form-control"
                            value={calcularTotal().toFixed(2)}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setShowForm(false)}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                    >
                      <i className="fas fa-save me-2"></i>
                      Emitir Factura
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

export default FacturacionCliente;