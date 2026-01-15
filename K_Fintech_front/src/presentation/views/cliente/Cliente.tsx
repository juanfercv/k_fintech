import React, { useState, useEffect } from 'react';
import { clienteService } from '../../../services/api';
import '../../../shared/public/Cliente.css'; // Asegúrate de crear este archivo CSS

interface Cliente {
  id_cliente: number;
  nombre_cliente: string;
  direccion_cliente: string;
  correo_cliente: string;
  celular_cliente: string;
  cedula_cliente: string;
}

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentCliente, setCurrentCliente] = useState<Cliente | null>(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await clienteService.getAll();
      setClientes(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los clientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentCliente(null);
    setShowForm(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setCurrentCliente(cliente);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        await clienteService.delete(id);
        fetchClientes();
      } catch (err) {
        setError('Error al eliminar el cliente');
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent, formData: FormData) => {
    e.preventDefault();
    const clienteData = {
      nombre_cliente: formData.get('nombre_cliente') as string,
      direccion_cliente: formData.get('direccion_cliente') as string,
      correo_cliente: formData.get('correo_cliente') as string,
      celular_cliente: formData.get('celular_cliente') as string,
      cedula_cliente: formData.get('cedula_cliente') as string,
    };

    try {
      if (currentCliente) {
        await clienteService.update(currentCliente.id_cliente, clienteData);
      } else {
        await clienteService.create(clienteData);
      }
      setShowForm(false);
      fetchClientes();
    } catch (err) {
      setError('Error al guardar el cliente');
      console.error(err);
    }
  };

  // Filtrado en tiempo real
  const clientesFiltrados = clientes.filter(c => 
    c.nombre_cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.cedula_cliente.includes(busqueda)
  );

  if (loading) return <div className="loading-state"><div className="spinner"></div>Cargando datos...</div>;
  if (error) return <div className="error-state">⚠️ {error}</div>;

  return (
    <div className="page-container">
      {/* Header con Título y Accis */}
      <header className="page-header">
        <div>
          <h2>Gestión de Clientes</h2>
        </div>
        <button onClick={handleCreate} className="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          Nuevo Cliente
        </button>
      </header>

      {/* Barra de Búsqueda */}
      <div className="search-bar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input 
          type="text" 
          placeholder="Buscar por nombre o cédula..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      
      {/* Grid de Clientes */}
      {clientesFiltrados.length === 0 ? (
        <div className="empty-state">No se encontraron clientes.</div>
      ) : (
        <div className="clientes-grid">
          {clientesFiltrados.map(cliente => (
            <div key={cliente.id_cliente} className="cliente-card">
              <div className="card-header">
                <div className="avatar">
                  {cliente.nombre_cliente.charAt(0).toUpperCase()}
                </div>
                <div className="card-title">
                  <h3>{cliente.nombre_cliente}</h3>
                  <span className="badge-cedula">{cliente.cedula_cliente}</span>
                </div>
              </div>
              
              <div className="card-body">
                <p><span className="icon">📧</span> {cliente.correo_cliente}</p>
                <p><span className="icon">📞</span> {cliente.celular_cliente}</p>
                <p><span className="icon">📍</span> {cliente.direccion_cliente}</p>
              </div>

              <div className="card-actions">
                <button onClick={() => handleEdit(cliente)} className="btn-icon edit" title="Editar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button onClick={() => handleDelete(cliente.id_cliente)} className="btn-icon delete" title="Eliminar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <ClienteForm 
          cliente={currentCliente} 
          onSubmit={handleSubmit} 
          onCancel={() => setShowForm(false)} 
        />
      )}
    </div>
  );
};

interface ClienteFormProps {
  cliente: Cliente | null;
  onSubmit: (e: React.FormEvent, formData: FormData) => void;
  onCancel: () => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ cliente, onSubmit, onCancel }) => {
  const handleSubmit = (e: React.FormEvent) => {
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    onSubmit(e, formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{cliente ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</h3>
          <button onClick={onCancel} className="close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Nombre Completo</label>
              <input name="nombre_cliente" defaultValue={cliente?.nombre_cliente} required placeholder="Ej: Juan Pérez" />
            </div>
            
            <div className="form-group">
              <label>Cédula / RUC</label>
              <input name="cedula_cliente" defaultValue={cliente?.cedula_cliente} required placeholder="Ej: 1712345678" />
            </div>

            <div className="form-group">
              <label>Celular</label>
              <input name="celular_cliente" defaultValue={cliente?.celular_cliente} required placeholder="Ej: 0991234567" />
            </div>
            
            <div className="form-group full-width">
              <label>Correo Electrónico</label>
              <input type="email" name="correo_cliente" defaultValue={cliente?.correo_cliente} required placeholder="ejemplo@correo.com" />
            </div>

            <div className="form-group full-width">
              <label>Dirección</label>
              <input name="direccion_cliente" defaultValue={cliente?.direccion_cliente} required placeholder="Calle principal y secundaria" />
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-primary">{cliente ? 'Guardar Cambios' : 'Registrar Cliente'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Clientes;