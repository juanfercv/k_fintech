import React, { useState } from 'react';
import { useMetodoPagoAdminViewModel } from '../../presentation/viewmodels/MetodoPagoAdminViewModel';
import type { MetodoPagoAdmin } from '../../domain/entities/MetodoPagoAdmin';

// Estilos inline para diseño responsivo consistente
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
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    minWidth: '200px',
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
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    color: '#374151',
    fontSize: 'clamp(13px, 2vw, 14px)',
    fontWeight: '500',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '8px',
    transform: 'scale(1.2)',
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
    minWidth: '900px',
  },
  tableHeader: {
    backgroundColor: '#f1f5f9',
    fontWeight: '600',
    color: '#1e293b',  // Texto oscuro en vez de blanco
    padding: '12px',
    textAlign: 'left' as const,
    borderBottom: '2px solid #e2e8f0',
    whiteSpace: 'nowrap' as const,
  },
  tableCell: {
    padding: '12px',
    borderBottom: '1px solid #e2e8f0',
    color: '#334155',  // Texto oscuro para mejor legibilidad
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
};

const MetodosPagoAdmin: React.FC = () => {
  const { 
    metodosPago, 
    loading, 
    error, 
    crearMetodoPago, 
    actualizarMetodoPago 
  } = useMetodoPagoAdminViewModel();
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    codigoInterno: '',
    codigoSRI: '',
    activo: true,
    permitePagoDiferido: false,
    maximoCuotas: 1,
    integracionPasarela: false
  });
  
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrandoForm, setMostrandoForm] = useState(false);
  const [confirmacion, setConfirmacion] = useState<{
    mostrar: boolean;
    accion: 'activar' | 'desactivar' | null;
    metodoId: number | null;
    metodoNombre: string;
  }>({ mostrar: false, accion: null, metodoId: null, metodoNombre: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editandoId) {
        await actualizarMetodoPago(editandoId, formData);
      } else {
        // Add default values for system-managed fields
        const formDataWithDefaults = {
          ...formData,
          fechaCreacion: new Date(),
          fechaModificacion: new Date(),
          habilitadoPorTienda: true,
          configuracionTiendas: []
        };
        await crearMetodoPago(formDataWithDefaults);
      }
      
      // Resetear formulario
      setFormData({
        nombre: '',
        descripcion: '',
        codigoInterno: '',
        codigoSRI: '',
        activo: true,
        permitePagoDiferido: false,
        maximoCuotas: 1,
        integracionPasarela: false
      });
      setEditandoId(null);
      setMostrandoForm(false);
    } catch (err) {
      console.error('Error al guardar método de pago:', err);
    }
  };

  const handleEditar = (metodo: MetodoPagoAdmin) => {
    setFormData({
      nombre: metodo.nombre,
      descripcion: metodo.descripcion,
      codigoInterno: metodo.codigoInterno,
      codigoSRI: metodo.codigoSRI,
      activo: metodo.activo,
      permitePagoDiferido: metodo.permitePagoDiferido,
      maximoCuotas: metodo.maximoCuotas,
      integracionPasarela: metodo.integracionPasarela
    });
    setEditandoId(metodo.id);
    setMostrandoForm(true);
  };

  const handleToggleActivo = (metodo: MetodoPagoAdmin) => {
    const accion = metodo.activo ? 'desactivar' : 'activar';
    setConfirmacion({
      mostrar: true,
      accion,
      metodoId: metodo.id,
      metodoNombre: metodo.nombre
    });
  };

  const handleConfirmarToggle = async () => {
    if (!confirmacion.metodoId || !confirmacion.accion) return;
    
    try {
      await actualizarMetodoPago(confirmacion.metodoId, { 
        activo: confirmacion.accion === 'activar',
        fechaModificacion: new Date()
      });
      
      // Cerrar modal
      setConfirmacion({ mostrar: false, accion: null, metodoId: null, metodoNombre: '' });
    } catch (err) {
      console.error(`Error al ${confirmacion.accion} método de pago:`, err);
      // Cerrar modal incluso si hay error
      setConfirmacion({ mostrar: false, accion: null, metodoId: null, metodoNombre: '' });
    }
  };

  const handleCancelarToggle = () => {
    setConfirmacion({ mostrar: false, accion: null, metodoId: null, metodoNombre: '' });
  };

  const handleCancelar = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      codigoInterno: '',
      codigoSRI: '',
      activo: true,
      permitePagoDiferido: false,
      maximoCuotas: 1,
      integracionPasarela: false
    });
    setEditandoId(null);
    setMostrandoForm(false);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <h2>Gestión de Métodos de Pago</h2>
        <p>Cargando métodos de pago...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <h2>Gestión de Métodos de Pago</h2>
        <p style={{ color: '#dc3545' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Gestión de Métodos de Pago</h2>
        
        <button 
          style={styles.primaryButton}
          onClick={() => setMostrandoForm(!mostrandoForm)}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6b46c1'}
        >
          {mostrandoForm ? 'Cancelar' : 'Agregar Método de Pago'}
        </button>
      </div>

      {mostrandoForm && (
        <div style={styles.formSection}>
          <h3 style={styles.formTitle}>{editandoId ? 'Editar Método de Pago' : 'Agregar Método de Pago'}</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="nombre" style={styles.label}>Nombre:</label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
                style={styles.input}
              />
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="descripcion" style={styles.label}>Descripción:</label>
              <input
                type="text"
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                required
                style={styles.input}
              />
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="codigoInterno" style={styles.label}>Código Interno:</label>
              <input
                type="text"
                id="codigoInterno"
                value={formData.codigoInterno}
                onChange={(e) => setFormData({...formData, codigoInterno: e.target.value})}
                required
                style={styles.input}
              />
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="codigoSRI" style={styles.label}>Código SRI:</label>
              <input
                type="text"
                id="codigoSRI"
                value={formData.codigoSRI}
                onChange={(e) => setFormData({...formData, codigoSRI: e.target.value})}
                required
                style={styles.input}
              />
            </div>
              
            <div style={styles.formGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                  style={styles.checkbox}
                />
                Activo
              </label>
            </div>
              
            <div style={styles.formGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.permitePagoDiferido}
                  onChange={(e) => setFormData({...formData, permitePagoDiferido: e.target.checked})}
                  style={styles.checkbox}
                />
                Permite Pago Diferido
              </label>
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="maximoCuotas" style={styles.label}>Máximo de Cuotas:</label>
              <input
                type="number"
                id="maximoCuotas"
                value={formData.maximoCuotas}
                onChange={(e) => setFormData({...formData, maximoCuotas: parseInt(e.target.value) || 1})}
                min="1"
                required
                style={styles.input}
              />
            </div>
              
            <div style={styles.formGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.integracionPasarela}
                  onChange={(e) => setFormData({...formData, integracionPasarela: e.target.checked})}
                  style={styles.checkbox}
                />
                Integración con Pasarela
              </label>
            </div>
            
            <div style={styles.formActions}>
              <button 
                type="submit" 
                style={styles.primaryButton}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6b46c1'}
              >
                {editandoId ? 'Actualizar' : 'Guardar'}
              </button>
              <button 
                type="button" 
                style={styles.secondaryButton}
                onClick={handleCancelar}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#cbd5e1'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#94a3b8'}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.listSection}>
        <h3 style={styles.listTitle}>Métodos de Pago Registrados</h3>
        
        <div style={{overflowX: 'auto'} as React.CSSProperties}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>ID</th>
                <th style={styles.tableHeader}>Nombre</th>
                <th style={styles.tableHeader}>Descripción</th>
                <th style={styles.tableHeader}>Código Interno</th>
                <th style={styles.tableHeader}>Código SRI</th>
                <th style={styles.tableHeader}>Activo</th>
                <th style={styles.tableHeader}>Pago Diferido</th>
                <th style={styles.tableHeader}>Máx. Cuotas</th>
                <th style={styles.tableHeader}>Int. Pasarela</th>
                <th style={styles.tableHeader}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {metodosPago.map(metodo => (
                <tr key={metodo.id}>
                  <td style={styles.tableCell}>{metodo.id}</td>
                  <td style={styles.tableCell}>{metodo.nombre}</td>
                  <td style={styles.tableCell}>{metodo.descripcion}</td>
                  <td style={styles.tableCell}>{metodo.codigoInterno}</td>
                  <td style={styles.tableCell}>{metodo.codigoSRI}</td>
                  <td style={styles.tableCell}>
                    <span style={metodo.activo ? styles.statusActive : styles.statusInactive}>
                      {metodo.activo ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td style={styles.tableCell}>{metodo.permitePagoDiferido ? 'Sí' : 'No'}</td>
                  <td style={styles.tableCell}>{metodo.maximoCuotas}</td>
                  <td style={styles.tableCell}>{metodo.integracionPasarela ? 'Sí' : 'No'}</td>
                  <td style={styles.tableCell}>
                    <button 
                      style={{...styles.actionButton, ...styles.editButton}}
                      onClick={() => handleEditar(metodo)}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      Editar
                    </button>
                    <button 
                      style={metodo.activo ? {...styles.actionButton, ...styles.deleteButton} : {...styles.actionButton, ...styles.activateButton}}
                      onClick={() => handleToggleActivo(metodo)}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      {metodo.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {metodosPago.length === 0 && (
          <p>No hay métodos de pago registrados.</p>
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
              ¿Estás seguro de {confirmacion.accion} el método de pago <strong>"{confirmacion.metodoNombre}"</strong>?
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

export default MetodosPagoAdmin;