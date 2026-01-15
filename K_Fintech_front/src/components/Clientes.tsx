import React, { useState, useEffect } from 'react';
import { clienteService } from '../services/api';

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
        await clienteService.delete(id.toString());
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
        // Update existing cliente
        await clienteService.update(currentCliente.id_cliente.toString(), clienteData);
      } else {
        // Create new cliente
        await clienteService.create(clienteData);
      }
      
      setShowForm(false);
      fetchClientes();
    } catch (err) {
      setError('Error al guardar el cliente');
      console.error(err);
    }
  };

  if (loading) return <div>Cargando clientes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="clientes-container">
      <h2>Gestión de Clientes</h2>
      
      <button onClick={handleCreate} className="btn btn-primary">
        Agregar Cliente
      </button>
      
      {showForm && (
        <ClienteForm 
          cliente={currentCliente} 
          onSubmit={handleSubmit} 
          onCancel={() => setShowForm(false)} 
        />
      )}
      
      <div className="clientes-list">
        {clientes.map(cliente => (
          <div key={cliente.id_cliente} className="cliente-card">
            <h3>{cliente.nombre_cliente}</h3>
            <p><strong>Cédula:</strong> {cliente.cedula_cliente}</p>
            <p><strong>Dirección:</strong> {cliente.direccion_cliente}</p>
            <p><strong>Teléfono:</strong> {cliente.celular_cliente}</p>
            <p><strong>Correo:</strong> {cliente.correo_cliente}</p>
            <div className="cliente-actions">
              <button onClick={() => handleEdit(cliente)} className="btn btn-secondary">
                Editar
              </button>
              <button onClick={() => handleDelete(cliente.id_cliente)} className="btn btn-danger">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
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
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(e, formData);
  };

  return (
    <div className="cliente-form-overlay">
      <div className="cliente-form">
        <h3>{cliente ? 'Editar Cliente' : 'Agregar Cliente'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre_cliente">Nombre:</label>
            <input
              type="text"
              id="nombre_cliente"
              name="nombre_cliente"
              defaultValue={cliente?.nombre_cliente || ''}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="direccion_cliente">Dirección:</label>
            <input
              type="text"
              id="direccion_cliente"
              name="direccion_cliente"
              defaultValue={cliente?.direccion_cliente || ''}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="correo_cliente">Correo Electrónico:</label>
            <input
              type="email"
              id="correo_cliente"
              name="correo_cliente"
              defaultValue={cliente?.correo_cliente || ''}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="celular_cliente">Teléfono:</label>
            <input
              type="text"
              id="celular_cliente"
              name="celular_cliente"
              defaultValue={cliente?.celular_cliente || ''}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cedula_cliente">Cédula:</label>
            <input
              type="text"
              id="cedula_cliente"
              name="cedula_cliente"
              defaultValue={cliente?.cedula_cliente || ''}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {cliente ? 'Actualizar' : 'Crear'}
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Clientes;