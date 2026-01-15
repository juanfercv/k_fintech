import React, { useState, useEffect } from 'react';
import { tiendaService, type Tienda } from '../services/api';

const Tiendas: React.FC = () => {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentTienda, setCurrentTienda] = useState<Tienda | null>(null);

  useEffect(() => {
    fetchTiendas();
  }, []);

  const fetchTiendas = async () => {
    try {
      setLoading(true);
      const data = await tiendaService.getAll();
      setTiendas(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las tiendas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentTienda(null);
    setShowForm(true);
  };

  const handleEdit = (tienda: Tienda) => {
    setCurrentTienda(tienda);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tienda?')) {
      try {
        await tiendaService.delete(id.toString());
        fetchTiendas();
      } catch (err) {
        setError('Error al eliminar la tienda');
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent, formData: FormData) => {
    e.preventDefault();
    
    const tiendaData = {
      fotoTienda: formData.get('fotoTienda') as string,
      nombreTienda: formData.get('nombreTienda') as string,
      dueñoTienda: formData.get('dueñoTienda') as string,
      RUCTienda: formData.get('RUCTienda') as string,
      dirección_matriz_tienda: formData.get('dirección_matriz_tienda') as string,
      direccion_sucursal_tienda: formData.get('direccion_sucursal_tienda') as string,
      correo_electronico_tienda: formData.get('correo_electronico_tienda') as string,
      telefono: formData.get('telefono') as string,
    };

    try {
      if (currentTienda) {
        // Update existing tienda
        await tiendaService.update(currentTienda.idTienda.toString(), tiendaData);
      } else {
        // Create new tienda
        await tiendaService.create(tiendaData);
      }
      
      setShowForm(false);
      fetchTiendas();
    } catch (err) {
      setError('Error al guardar la tienda');
      console.error(err);
    }
  };

  if (loading) return <div>Cargando tiendas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="tiendas-container">
      <h2>Gestión de Tiendas</h2>
      
      <button onClick={handleCreate} className="btn btn-primary">
        Agregar Tienda
      </button>
      
      {showForm && (
        <TiendaForm 
          tienda={currentTienda} 
          onSubmit={handleSubmit} 
          onCancel={() => setShowForm(false)} 
        />
      )}
      
      <div className="tiendas-list">
        {tiendas.map(tienda => (
          <div key={tienda.idTienda} className="tienda-card">
            <h3>{tienda.nombreTienda}</h3>
            <p><strong>Dueño:</strong> {tienda.dueñoTienda}</p>
            <p><strong>RUC:</strong> {tienda.RUCTienda}</p>
            <p><strong>Dirección:</strong> {tienda.dirección_matriz_tienda}</p>
            <p><strong>Teléfono:</strong> {tienda.telefono}</p>
            <p><strong>Correo:</strong> {tienda.correo_electronico_tienda}</p>
            <div className="tienda-actions">
              <button onClick={() => handleEdit(tienda)} className="btn btn-secondary">
                Editar
              </button>
              <button onClick={() => handleDelete(tienda.idTienda)} className="btn btn-danger">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface TiendaFormProps {
  tienda: Tienda | null;
  onSubmit: (e: React.FormEvent, formData: FormData) => void;
  onCancel: () => void;
}

const TiendaForm: React.FC<TiendaFormProps> = ({ tienda, onSubmit, onCancel }) => {
  const handleSubmit = (e: React.FormEvent) => {
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(e, formData);
  };

  return (
    <div className="tienda-form-overlay">
      <div className="tienda-form">
        <h3>{tienda ? 'Editar Tienda' : 'Agregar Tienda'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombreTienda">Nombre de la Tienda:</label>
            <input
              type="text"
              id="nombreTienda"
              name="nombreTienda"
              defaultValue={tienda?.nombreTienda || ''}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dueñoTienda">Dueño:</label>
            <input
              type="text"
              id="dueñoTienda"
              name="dueñoTienda"
              defaultValue={tienda?.dueñoTienda || ''}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="RUCTienda">RUC:</label>
            <input
              type="text"
              id="RUCTienda"
              name="RUCTienda"
              defaultValue={tienda?.RUCTienda || ''}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dirección_matriz_tienda">Dirección Matriz:</label>
            <input
              type="text"
              id="dirección_matriz_tienda"
              name="dirección_matriz_tienda"
              defaultValue={tienda?.dirección_matriz_tienda || ''}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="direccion_sucursal_tienda">Dirección Sucursal:</label>
            <input
              type="text"
              id="direccion_sucursal_tienda"
              name="direccion_sucursal_tienda"
              defaultValue={tienda?.direccion_sucursal_tienda || ''}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="correo_electronico_tienda">Correo Electrónico:</label>
            <input
              type="email"
              id="correo_electronico_tienda"
              name="correo_electronico_tienda"
              defaultValue={tienda?.correo_electronico_tienda || ''}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              defaultValue={tienda?.telefono || ''}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="fotoTienda">Foto URL:</label>
            <input
              type="text"
              id="fotoTienda"
              name="fotoTienda"
              defaultValue={tienda?.fotoTienda || ''}
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {tienda ? 'Actualizar' : 'Crear'}
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

export default Tiendas;