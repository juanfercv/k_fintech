import React, { useState, useEffect } from 'react';

interface Cliente {
  id: number;
  tipoCliente: 'NATURAL' | 'JURIDICO';
  identificacion: string;
  nombreRazonSocial: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: 'ACTIVO' | 'INACTIVO';
  fechaRegistro: string;
}

// Estilos inline para mejor presentación responsive
const styles = {
  container: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '15px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    boxSizing: 'border-box' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    paddingBottom: '12px',
    borderBottom: '2px solid #6b46c1',
    flexWrap: 'wrap' as const,
    gap: '15px',
  },
  title: {
    color: '#4c1d95',
    fontSize: 'clamp(20px, 4vw, 28px)',
    fontWeight: '600',
    margin: 0,
    flex: 1,
    minWidth: '200px',
  },
  primaryButton: {
    backgroundColor: '#6b46c1',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: 'clamp(14px, 2.5vw, 16px)',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap' as const,
  },
  formSection: {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '25px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    boxSizing: 'border-box' as const,
  },
  formTitle: {
    color: '#4c1d95',
    fontSize: 'clamp(16px, 3vw, 20px)',
    marginBottom: '15px',
    fontWeight: '600',
  },
  form: {
    display: 'grid',
    gap: '15px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
  },
  input: {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: 'clamp(13px, 2vw, 14px)',
    transition: 'border-color 0.3s ease',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  select: {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: 'clamp(13px, 2vw, 14px)',
    backgroundColor: 'white',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  formActions: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
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
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    overflowX: 'auto' as const,
    boxSizing: 'border-box' as const,
  },
  listTitle: {
    color: '#4c1d95',
    fontSize: 'clamp(16px, 3vw, 20px)',
    marginBottom: '15px',
    fontWeight: '600',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: 'clamp(12px, 2vw, 14px)',
    minWidth: '800px',
  },
  tableHeader: {
    backgroundColor: '#f1f5f9',
    fontWeight: '600',
    color: '#1e293b',
    padding: '12px',
    textAlign: 'left' as const,
    borderBottom: '2px solid #e2e8f0',
    whiteSpace: 'nowrap' as const,
  },
  tableCell: {
    padding: '12px',
    borderBottom: '1px solid #e2e8f0',
    color: '#334155',
    whiteSpace: 'nowrap' as const,
  },
  statusActive: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  statusInactive: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  actionButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    marginRight: '8px',
    transition: 'all 0.3s ease',
  },
  editButton: {
    backgroundColor: '#fbbf24',
    color: '#78350f',
  },
  deleteButton: {
    backgroundColor: '#f87171',
    color: '#7f1d1d',
  },
  activateButton: {
    backgroundColor: '#34d399',
    color: '#065f46',
  },
  warningBox: {
    backgroundColor: '#fffbeb',
    border: '1px solid #fbbf24',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    color: '#92400e'
  }
};

const ClienteAdmin: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Estado para confirmación personalizada
  const [confirmacion, setConfirmacion] = useState<{
    mostrar: boolean;
    accion: 'activar' | 'desactivar' | null;
    clienteId: number | null;
    clienteNombre: string;
  }>({ mostrar: false, accion: null, clienteId: null, clienteNombre: '' });
  
  const [formData, setFormData] = useState({
    tipoCliente: 'NATURAL' as 'NATURAL' | 'JURIDICO',
    identificacion: '',
    nombreRazonSocial: '',
    direccion: '',
    telefono: '',
    email: '',
    estado: 'ACTIVO' as 'ACTIVO' | 'INACTIVO'
  });

  // Fetch clientes del backend
  const fetchClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:4200/api/clientes');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transformar datos del backend
      const clientesTransformados = data.map((item: any) => ({
        id: item.id_cliente || item.id,
        tipoCliente: 'NATURAL',
        identificacion: item.cedula_cliente || '',
        nombreRazonSocial: item.nombre_cliente || '',
        direccion: item.direccion_cliente || '',
        telefono: item.celular_cliente || '',
        email: item.correo_cliente || '',
        estado: item.estado || 'ACTIVO',
        fechaRegistro: item.crearCliente || new Date().toISOString()
      }));
      
      setClientes(clientesTransformados);
    } catch (err) {
      console.error('Error fetching clientes:', err);
      setError('No se pudo conectar con el backend. Asegúrate de que el servidor esté corriendo en el puerto 4200.');
    } finally {
      setLoading(false);
    }
  };

  // Efecto inicial para cargar datos
  useEffect(() => {
    fetchClientes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica mínima (solo longitud)
    if (formData.identificacion.trim().length === 0) {
      alert('Por favor ingrese una identificación');
      return;
    }
    
    // Validación flexible - solo verifica formato básico
    const isValidFormat = formData.tipoCliente === 'NATURAL' 
      ? /^\d{1,15}$/.test(formData.identificacion)  // 1-15 dígitos para cédula
      : /^\d{1,15}$/.test(formData.identificacion); // 1-15 dígitos para RUC
    
    if (!isValidFormat) {
      if (!window.confirm('La identificación no sigue el formato estándar. ¿Desea continuar de todos modos?')) {
        return;
      }
    }
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `http://localhost:4200/api/clientes/${editingId}`
        : 'http://localhost:4200/api/clientes';
      
      // Preparar datos para enviar al backend
      const datosBackend = {
        nombre_cliente: formData.nombreRazonSocial,
        direccion_cliente: formData.direccion,
        correo_cliente: formData.email,
        celular_cliente: formData.telefono,
        cedula_cliente: formData.identificacion,
        estado: formData.estado
      };
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosBackend)
      });
      
      if (response.ok) {
        setShowForm(false);
        setEditingId(null);
        fetchClientes(); // Recargar datos
      } else {
        const errorData = await response.json();
        alert(`Error al guardar: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (err) {
      console.error('Error saving cliente:', err);
      alert('Error de conexión. Verifique que el servidor esté corriendo.');
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setFormData({
      tipoCliente: cliente.tipoCliente,
      identificacion: cliente.identificacion,
      nombreRazonSocial: cliente.nombreRazonSocial,
      direccion: cliente.direccion,
      telefono: cliente.telefono,
      email: cliente.email,
      estado: cliente.estado
    });
    setEditingId(cliente.id);
    setShowForm(true);
  };

  // Toggle personalizado
  const handleToggleEstado = (cliente: Cliente) => {
    const accion = cliente.estado === 'ACTIVO' ? 'desactivar' : 'activar';
    setConfirmacion({
      mostrar: true,
      accion,
      clienteId: cliente.id,
      clienteNombre: cliente.nombreRazonSocial
    });
  };

  const handleConfirmarToggle = async () => {
    if (!confirmacion.clienteId || !confirmacion.accion) return;
    
    try {
      const nuevoEstado = confirmacion.accion === 'activar' ? 'ACTIVO' : 'INACTIVO';
      const response = await fetch(`http://localhost:4200/api/clientes/${confirmacion.clienteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      
      if (response.ok) {
        fetchClientes();
      }
      
      // Cerrar modal
      setConfirmacion({ mostrar: false, accion: null, clienteId: null, clienteNombre: '' });
    } catch (err) {
      console.error('Error updating cliente:', err);
      // Cerrar modal incluso si hay error
      setConfirmacion({ mostrar: false, accion: null, clienteId: null, clienteNombre: '' });
    }
  };

  const handleCancelarToggle = () => {
    setConfirmacion({ mostrar: false, accion: null, clienteId: null, clienteNombre: '' });
  };

  const resetForm = () => {
    setFormData({
      tipoCliente: 'NATURAL',
      identificacion: '',
      nombreRazonSocial: '',
      direccion: '',
      telefono: '',
      email: '',
      estado: 'ACTIVO'
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>Gestión de Clientes</h2>
        <p>Cargando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2>Gestión de Clientes</h2>
        <p style={{ color: '#ef4444' }}>{error}</p>
        <button 
          style={styles.primaryButton}
          onClick={() => fetchClientes()}
        >
          Reintentar Conexión
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Gestión de Clientes</h2>
        <button 
          style={styles.primaryButton}
          onClick={() => setShowForm(!showForm)}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6b46c1'}
        >
          {showForm ? 'Cancelar' : 'Nuevo Cliente'}
        </button>
      </div>

      {/* Advertencia sobre validación flexible */}
      <div style={styles.warningBox}>
        <strong>ℹ️ Nota:</strong> La validación de identificación es flexible para facilitar las pruebas. 
        En producción, se recomienda implementar validaciones más estrictas.
      </div>

      {showForm && (
        <div style={styles.formSection}>
          <h3 style={styles.formTitle}>{editingId ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo de Cliente:</label>
                <select 
                  name="tipoCliente" 
                  value={formData.tipoCliente}
                  onChange={handleInputChange}
                  style={styles.select}
                  required
                >
                  <option value="NATURAL">Persona Natural</option>
                  <option value="JURIDICO">Persona Jurídica</option>
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>{formData.tipoCliente === 'NATURAL' ? 'Identificación (Cédula)' : 'Identificación (RUC)'}:</label>
                <input
                  type="text"
                  name="identificacion"
                  value={formData.identificacion}
                  onChange={handleInputChange}
                  placeholder="Ingrese identificación"
                  style={styles.input}
                  required
                />
              </div>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>{formData.tipoCliente === 'NATURAL' ? 'Nombres y Apellidos' : 'Razón Social'}:</label>
              <input
                type="text"
                name="nombreRazonSocial"
                value={formData.nombreRazonSocial}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Dirección:</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Teléfono:</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.formActions}>
              <button 
                type="submit" 
                style={styles.primaryButton}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6b46c1'}
              >
                {editingId ? 'Actualizar' : 'Guardar'}
              </button>
              <button 
                type="button" 
                style={styles.secondaryButton}
                onClick={resetForm}
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
        <h3 style={styles.listTitle}>Clientes Registrados ({clientes.length})</h3>
        
        <div style={{overflowX: 'auto'} as React.CSSProperties}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>ID</th>
                <th style={styles.tableHeader}>Tipo</th>
                <th style={styles.tableHeader}>Identificación</th>
                <th style={styles.tableHeader}>Nombre/Razón Social</th>
                <th style={styles.tableHeader}>Dirección</th>
                <th style={styles.tableHeader}>Teléfono</th>
                <th style={styles.tableHeader}>Email</th>
                <th style={styles.tableHeader}>Estado</th>
                <th style={styles.tableHeader}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente, index) => (
                <tr key={`cliente-${cliente.id}-${index}`}>
                  <td style={styles.tableCell}>{cliente.id}</td>
                  <td style={styles.tableCell}>{cliente.tipoCliente === 'NATURAL' ? 'Natural' : 'Jurídico'}</td>
                  <td style={styles.tableCell}>{cliente.identificacion}</td>
                  <td style={styles.tableCell}>{cliente.nombreRazonSocial}</td>
                  <td style={styles.tableCell}>{cliente.direccion}</td>
                  <td style={styles.tableCell}>{cliente.telefono}</td>
                  <td style={styles.tableCell}>{cliente.email}</td>
                  <td style={styles.tableCell}>
                    <span style={cliente.estado === 'ACTIVO' ? styles.statusActive : styles.statusInactive}>
                      {cliente.estado}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <button 
                      style={{...styles.actionButton, ...styles.editButton}}
                      onClick={() => handleEdit(cliente)}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      Editar
                    </button>
                    <button 
                      style={cliente.estado === 'ACTIVO' 
                        ? {...styles.actionButton, ...styles.deleteButton}
                        : {...styles.actionButton, ...styles.activateButton}
                      }
                      onClick={() => handleToggleEstado(cliente)}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      {cliente.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {clientes.length === 0 && (
          <p style={{padding: '40px', textAlign: 'center', color: '#64748b'}}>
            <div style={{fontSize: '3rem', marginBottom: '15px'}}>👥</div>
            <h3>No hay clientes registrados</h3>
            <p>Haz clic en "Nuevo Cliente" para registrar tu primer cliente</p>
          </p>
        )}
      </div>

      {/* Modal de Confirmación Personalizado */}
      {confirmacion.mostrar && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h3 style={{
              color: '#4c1d95',
              marginBottom: '20px',
              fontSize: '20px'
            }}>
              Confirmar Acción
            </h3>
            
            <p style={{
              color: '#374151',
              fontSize: '16px',
              marginBottom: '25px',
              lineHeight: '1.5'
            }}>
              ¿Estás seguro de {confirmacion.accion} el cliente <strong>"{confirmacion.clienteNombre}"</strong>?
            </p>
            
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center'
            }}>
              <button
                onClick={handleConfirmarToggle}
                style={{
                  backgroundColor: '#6b46c1',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6b46c1'}
              >
                Confirmar
              </button>
              
              <button
                onClick={handleCancelarToggle}
                style={{
                  backgroundColor: '#94a3b8',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#64748b'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#94a3b8'}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClienteAdmin;