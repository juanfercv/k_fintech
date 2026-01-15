import React, { useState, useEffect } from 'react';

// Estilos profesionales inline
const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '2px solid #10b981',
  },
  title: {
    color: '#065f46',
    fontSize: '28px',
    fontWeight: '600',
    margin: 0,
  },
  primaryButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  filterSection: {
    backgroundColor: '#f0fdf4',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '25px',
    border: '1px solid #bbf7d0',
  },
  filterTitle: {
    color: '#065f46',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
  },
  filterRow: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap' as const,
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    minWidth: '200px',
  },
  label: {
    marginBottom: '6px',
    fontWeight: '500',
    color: '#374151',
    fontSize: '14px',
  },
  select: {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  input: {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
  },
  formSection: {
    backgroundColor: '#f8fafc',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  formTitle: {
    color: '#1e293b',
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  formActions: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
    gridColumn: '1 / -1',
  },
  secondaryButton: {
    backgroundColor: '#94a3b8',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  listSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  listTitle: {
    color: '#1e293b',
    fontSize: '20px',
    fontWeight: '600',
    padding: '20px',
    margin: 0,
    borderBottom: '1px solid #e2e8f0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  tableHeader: {
    backgroundColor: '#f1f5f9',
    padding: '16px',
    textAlign: 'left' as const,
    fontWeight: '600',
    color: '#334155',
    fontSize: '14px',
  },
  tableCell: {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    color: '#334155',
    fontSize: '14px',
  },
  actionButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginRight: '8px',
    transition: 'all 0.3s ease',
  },
  editButton: {
    backgroundColor: '#f59e0b',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    color: 'white',
  },
  viewButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  statusActive: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  statusInactive: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  detailModal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  detailContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto' as const,
  },
  detailTitle: {
    color: '#1e293b',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '20px',
    textAlign: 'center' as const,
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '20px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#64748b',
    fontSize: '14px',
    marginBottom: '5px',
  },
  detailValue: {
    color: '#1e293b',
    fontSize: '16px',
  },
};

const TiendasAdmin: React.FC = () => {
  const [tiendas, setTiendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState({ estado: '', ciudad: '', nombre: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingTienda, setViewingTienda] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    nombreTienda: '',
    dueñoTienda: '',
    RUCTienda: '',
    dirección_matriz_tienda: '',
    direccion_sucursal_tienda: '',
    correo_electronico_tienda: '',
    telefono: '',
    ciudad: '',
    codigoPuntoEmision: '',
    estado: 'activa' as 'activa' | 'inactiva',
    fotoTienda: '',
    configuracionFacturacion: {
      ambiente: 'produccion' as 'produccion' | 'pruebas',
      tipoEmision: 'normal' as 'normal' | 'contingencia',
      secuencialInicio: 1
    }
  });

  // Fetch de tiendas
  const fetchTiendas = async (filtrosAplicar = filtros) => {
    try {
      setLoading(true);
      setError(null);
      
      let url = 'http://localhost:4200/api/tiendas';
      const queryParams = new URLSearchParams();
      
      if (filtrosAplicar.estado) queryParams.append('estado', filtrosAplicar.estado);
      if (filtrosAplicar.ciudad) queryParams.append('ciudad', filtrosAplicar.ciudad);
      if (filtrosAplicar.nombre) queryParams.append('nombre', filtrosAplicar.nombre);
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTiendas(data);
    } catch (err) {
      console.error('Error fetching tiendas:', err);
      setError('No se pudo conectar con el backend. Asegúrate de que el servidor esté corriendo en el puerto 4200.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiendas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `http://localhost:4200/api/tiendas/${editingId}`
        : 'http://localhost:4200/api/tiendas';
      
      const tiendaToSend = {
        ...formData,
        configuracionFacturacion: JSON.stringify(formData.configuracionFacturacion)
      };
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tiendaToSend)
      });
      
      if (response.ok) {
        setShowForm(false);
        setEditingId(null);
        fetchTiendas(); // Recargar datos
      }
    } catch (err) {
      console.error('Error saving tienda:', err);
    }
  };

  const handleEditar = (tienda: any) => {
    const config = typeof tienda.configuracionFacturacion === 'string' 
      ? JSON.parse(tienda.configuracionFacturacion)
      : tienda.configuracionFacturacion || { ambiente: 'produccion', tipoEmision: 'normal', secuencialInicio: 1 };
    
    setFormData({
      nombreTienda: tienda.nombreTienda,
      dueñoTienda: tienda.dueñoTienda,
      RUCTienda: tienda.RUCTienda,
      dirección_matriz_tienda: tienda.dirección_matriz_tienda,
      direccion_sucursal_tienda: tienda.direccion_sucursal_tienda || '',
      correo_electronico_tienda: tienda.correo_electronico_tienda,
      telefono: tienda.telefono,
      ciudad: tienda.ciudad || '',
      codigoPuntoEmision: tienda.codigoPuntoEmision || '',
      estado: tienda.estado,
      fotoTienda: tienda.fotoTienda || '',
      configuracionFacturacion: config
    });
    setEditingId(tienda.idTienda);
    setShowForm(true);
  };

  const handleVerDetalle = (tienda: any) => {
    setViewingTienda(tienda);
  };

  const handleEliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de desactivar esta tienda? (Se realizará eliminación lógica)')) {
      try {
        const response = await fetch(`http://localhost:4200/api/tiendas/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: 'inactiva' })
        });
        
        if (response.ok) {
          fetchTiendas();
        }
      } catch (err) {
        console.error('Error deleting tienda:', err);
      }
    }
  };

  const handleCancelar = () => {
    setFormData({
      nombreTienda: '',
      dueñoTienda: '',
      RUCTienda: '',
      dirección_matriz_tienda: '',
      direccion_sucursal_tienda: '',
      correo_electronico_tienda: '',
      telefono: '',
      ciudad: '',
      codigoPuntoEmision: '',
      estado: 'activa',
      fotoTienda: '',
      configuracionFacturacion: {
        ambiente: 'produccion',
        tipoEmision: 'normal',
        secuencialInicio: 1
      }
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAplicarFiltros = () => {
    fetchTiendas(filtros);
  };

  const handleLimpiarFiltros = () => {
    const filtrosLimpios = { estado: '', ciudad: '', nombre: '' };
    setFiltros(filtrosLimpios);
    fetchTiendas(filtrosLimpios);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>Gestión de Tiendas</h2>
        <p>Cargando tiendas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2>Gestión de Tiendas</h2>
        <p style={{ color: '#ef4444' }}>{error}</p>
        <button 
          style={styles.primaryButton}
          onClick={() => fetchTiendas()}
        >
          Reintentar Conexión
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Gestión de Tiendas</h2>
        
        <button 
          style={styles.primaryButton}
          onClick={() => setShowForm(!showForm)}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
        >
          {showForm ? 'Cancelar' : 'Nueva Tienda'}
        </button>
      </div>

      {/* Filtros */}
      <div style={styles.filterSection}>
        <h3 style={styles.filterTitle}>Filtros de Búsqueda</h3>
        <div style={styles.filterRow}>
          <div style={styles.filterGroup}>
            <label htmlFor="filtroEstado" style={styles.label}>Estado:</label>
            <select
              id="filtroEstado"
              value={filtros.estado}
              onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
              style={styles.select}
            >
              <option value="">Todos los estados</option>
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
            </select>
          </div>
          
          <div style={styles.filterGroup}>
            <label htmlFor="filtroCiudad" style={styles.label}>Ciudad:</label>
            <input
              type="text"
              id="filtroCiudad"
              value={filtros.ciudad}
              onChange={(e) => setFiltros({...filtros, ciudad: e.target.value})}
              placeholder="Buscar por ciudad"
              style={styles.input}
            />
          </div>
          
          <div style={styles.filterGroup}>
            <label htmlFor="filtroNombre" style={styles.label}>Nombre:</label>
            <input
              type="text"
              id="filtroNombre"
              value={filtros.nombre}
              onChange={(e) => setFiltros({...filtros, nombre: e.target.value})}
              placeholder="Buscar por nombre"
              style={styles.input}
            />
          </div>
          
          <div style={{...styles.filterGroup, justifyContent: 'flex-end', minWidth: 'auto'}}>
            <div style={{display: 'flex', gap: '10px', marginTop: '26px'}}>
              <button 
                style={{...styles.primaryButton, padding: '10px 20px'}}
                onClick={handleAplicarFiltros}
              >
                Aplicar Filtros
              </button>
              <button 
                style={{...styles.secondaryButton, padding: '10px 20px'}}
                onClick={handleLimpiarFiltros}
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div style={styles.formSection}>
          <h3 style={styles.formTitle}>{editingId ? 'Editar Tienda' : 'Nueva Tienda'}</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="nombreTienda" style={styles.label}>Nombre Comercial:</label>
              <input
                type="text"
                id="nombreTienda"
                value={formData.nombreTienda}
                onChange={(e) => setFormData({...formData, nombreTienda: e.target.value})}
                required
                style={styles.input}
              />
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="dueñoTienda" style={styles.label}>Nombre del Dueño:</label>
              <input
                type="text"
                id="dueñoTienda"
                value={formData.dueñoTienda}
                onChange={(e) => setFormData({...formData, dueñoTienda: e.target.value})}
                required
                style={styles.input}
              />
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="RUCTienda" style={styles.label}>RUC:</label>
              <input
                type="text"
                id="RUCTienda"
                value={formData.RUCTienda}
                onChange={(e) => setFormData({...formData, RUCTienda: e.target.value})}
                required
                style={styles.input}
              />
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="direccion_matriz_tienda" style={styles.label}>Dirección Matriz:</label>
              <input
                type="text"
                id="direccion_matriz_tienda"
                value={formData.dirección_matriz_tienda}
                onChange={(e) => setFormData({...formData, dirección_matriz_tienda: e.target.value})}
                required
                style={styles.input}
              />
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="direccion_sucursal_tienda" style={styles.label}>Dirección Sucursal:</label>
              <input
                type="text"
                id="direccion_sucursal_tienda"
                value={formData.direccion_sucursal_tienda}
                onChange={(e) => setFormData({...formData, direccion_sucursal_tienda: e.target.value})}
                style={styles.input}
              />
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="ciudad" style={styles.label}>Ciudad:</label>
              <input
                type="text"
                id="ciudad"
                value={formData.ciudad}
                onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                style={styles.input}
              />
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="codigoPuntoEmision" style={styles.label}>Código Punto Emisión:</label>
              <input
                type="text"
                id="codigoPuntoEmision"
                value={formData.codigoPuntoEmision}
                onChange={(e) => setFormData({...formData, codigoPuntoEmision: e.target.value})}
                style={styles.input}
              />
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="correo_electronico_tienda" style={styles.label}>Correo Electrónico:</label>
              <input
                type="email"
                id="correo_electronico_tienda"
                value={formData.correo_electronico_tienda}
                onChange={(e) => setFormData({...formData, correo_electronico_tienda: e.target.value})}
                required
                style={styles.input}
              />
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="telefono" style={styles.label}>Teléfono:</label>
              <input
                type="text"
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                required
                style={styles.input}
              />
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="estado" style={styles.label}>Estado:</label>
              <select
                id="estado"
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value as any})}
                required
                style={styles.select}
              >
                <option value="activa">Activa</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="fotoTienda" style={styles.label}>URL Foto:</label>
              <input
                type="text"
                id="fotoTienda"
                value={formData.fotoTienda}
                onChange={(e) => setFormData({...formData, fotoTienda: e.target.value})}
                style={styles.input}
              />
            </div>
            
            <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
              <h4 style={{marginBottom: '15px', color: '#374151'}}>Configuración de Facturación</h4>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
                <div>
                  <label style={styles.label}>Ambiente:</label>
                  <select
                    value={formData.configuracionFacturacion.ambiente}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuracionFacturacion: {
                        ...formData.configuracionFacturacion,
                        ambiente: e.target.value as any
                      }
                    })}
                    style={styles.select}
                  >
                    <option value="produccion">Producción</option>
                    <option value="pruebas">Pruebas</option>
                  </select>
                </div>
                
                <div>
                  <label style={styles.label}>Tipo Emisión:</label>
                  <select
                    value={formData.configuracionFacturacion.tipoEmision}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuracionFacturacion: {
                        ...formData.configuracionFacturacion,
                        tipoEmision: e.target.value as any
                      }
                    })}
                    style={styles.select}
                  >
                    <option value="normal">Normal</option>
                    <option value="contingencia">Contingencia</option>
                  </select>
                </div>
                
                <div>
                  <label style={styles.label}>Secuencial Inicio:</label>
                  <input
                    type="number"
                    value={formData.configuracionFacturacion.secuencialInicio}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuracionFacturacion: {
                        ...formData.configuracionFacturacion,
                        secuencialInicio: parseInt(e.target.value) || 1
                      }
                    })}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
            
            <div style={styles.formActions}>
              <button 
                type="submit" 
                style={styles.primaryButton}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
              >
                {editingId ? 'Actualizar' : 'Guardar'}
              </button>
              <button 
                type="button" 
                style={styles.secondaryButton}
                onClick={handleCancelar}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#64748b'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#94a3b8'}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.listSection}>
        <h3 style={styles.listTitle}>Tiendas Registradas ({tiendas.length})</h3>
        
        <div style={{overflowX: 'auto'} as React.CSSProperties}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>ID</th>
                <th style={styles.tableHeader}>Nombre</th>
                <th style={styles.tableHeader}>Dueño</th>
                <th style={styles.tableHeader}>RUC</th>
                <th style={styles.tableHeader}>Ciudad</th>
                <th style={styles.tableHeader}>Teléfono</th>
                <th style={styles.tableHeader}>Estado</th>
                <th style={styles.tableHeader}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tiendas.map((tienda) => (
                <tr key={tienda.idTienda}>
                  <td style={styles.tableCell}>{tienda.idTienda}</td>
                  <td style={styles.tableCell}>{tienda.nombreTienda}</td>
                  <td style={styles.tableCell}>{tienda.dueñoTienda}</td>
                  <td style={styles.tableCell}>{tienda.RUCTienda}</td>
                  <td style={styles.tableCell}>{tienda.ciudad || '-'}</td>
                  <td style={styles.tableCell}>{tienda.telefono}</td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.statusBadge,
                      ...(tienda.estado === 'activa' ? styles.statusActive : styles.statusInactive)
                    }}>
                      {tienda.estado === 'activa' ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <button 
                      style={{...styles.actionButton, ...styles.viewButton}}
                      onClick={() => handleVerDetalle(tienda)}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      Ver Detalle
                    </button>
                    <button 
                      style={{...styles.actionButton, ...styles.editButton}}
                      onClick={() => handleEditar(tienda)}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      Editar
                    </button>
                    {tienda.estado === 'activa' && (
                      <button 
                        style={{...styles.actionButton, ...styles.deleteButton}}
                        onClick={() => handleEliminar(tienda.idTienda)}
                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        Desactivar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tiendas.length === 0 && (
          <p style={{padding: '40px', textAlign: 'center', color: '#64748b'}}>
            <div style={{fontSize: '3rem', marginBottom: '15px'}}>🏪</div>
            <h3>No hay tiendas registradas</h3>
            <p>Haz clic en "Nueva Tienda" para registrar tu primera tienda</p>
          </p>
        )}
      </div>

      {/* Modal de Detalle */}
      {viewingTienda && (
        <div 
          style={styles.detailModal}
          onClick={() => setViewingTienda(null)}
        >
          <div 
            style={styles.detailContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={styles.detailTitle}>Detalles de la Tienda</h2>
            
            <div style={styles.detailGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>ID Tienda:</span>
                <span style={styles.detailValue}>{viewingTienda.idTienda}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Nombre Comercial:</span>
                <span style={styles.detailValue}>{viewingTienda.nombreTienda}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Dueño:</span>
                <span style={styles.detailValue}>{viewingTienda.dueñoTienda}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>RUC:</span>
                <span style={styles.detailValue}>{viewingTienda.RUCTienda}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Dirección Matriz:</span>
                <span style={styles.detailValue}>{viewingTienda.dirección_matriz_tienda}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Dirección Sucursal:</span>
                <span style={styles.detailValue}>{viewingTienda.direccion_sucursal_tienda || 'No especificada'}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Ciudad:</span>
                <span style={styles.detailValue}>{viewingTienda.ciudad || 'No especificada'}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Código Punto Emisión:</span>
                <span style={styles.detailValue}>{viewingTienda.codigoPuntoEmision || 'No especificado'}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Correo Electrónico:</span>
                <span style={styles.detailValue}>{viewingTienda.correo_electronico_tienda}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Teléfono:</span>
                <span style={styles.detailValue}>{viewingTienda.telefono}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Estado:</span>
                <span style={styles.detailValue}>
                  <span style={{
                    ...styles.statusBadge,
                    ...(viewingTienda.estado === 'activa' ? styles.statusActive : styles.statusInactive)
                  }}>
                    {viewingTienda.estado === 'activa' ? 'Activa' : 'Inactiva'}
                  </span>
                </span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Fecha Creación:</span>
                <span style={styles.detailValue}>
                  {viewingTienda.crearTienda 
                    ? new Date(viewingTienda.crearTienda).toLocaleDateString()
                    : 'No disponible'
                  }
                </span>
              </div>
            </div>
            
            <div style={{marginTop: '20px', textAlign: 'center' as const}}>
              <button 
                style={{...styles.primaryButton, padding: '10px 25px'}}
                onClick={() => setViewingTienda(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiendasAdmin;