import React, { useState, useEffect, useCallback } from 'react';

// Estilos compartidos (misma estructura que otros CRUD)
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '2px solid #3b82f6'
  },
  title: {
    color: '#1e40af',
    fontSize: '28px',
    fontWeight: '600',
    margin: 0
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  formSection: {
    backgroundColor: '#f8fafc',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  formTitle: {
    color: '#1e40af',
    fontSize: '20px',
    marginBottom: '20px',
    fontWeight: '600'
  },
  form: {
    display: 'grid',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const
  },
  label: {
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px'
  },
  input: {
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.3s ease'
  },
  formActions: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px'
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
    transition: 'all 0.3s ease'
  },
  listSection: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  listTitle: {
    color: '#1e40af',
    fontSize: '20px',
    marginBottom: '20px',
    fontWeight: '600'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '14px'
  },
  tableHeader: {
    backgroundColor: '#f1f5f9',
    fontWeight: '600',
    color: '#1e293b',
    padding: '12px',
    textAlign: 'left' as const,
    borderBottom: '2px solid #e2e8f0'
  },
  tableCell: {
    padding: '12px',
    borderBottom: '1px solid #e2e8f0',
    color: '#334155'
  },
  actionButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    marginRight: '8px',
    transition: 'all 0.3s ease'
  },
  editButton: {
    backgroundColor: '#fbbf24',
    color: '#78350f'
  },
  deleteButton: {
    backgroundColor: '#f87171',
    color: '#7f1d1d'
  }
};

const FacturasAdmin: React.FC = () => {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [tiendas, setTiendas] = useState<any[]>([]);
  const [clientesList, setClientesList] = useState<any[]>([]);
  const [formasPago, setFormasPago] = useState<any[]>([]);
  const [mastersLoading, setMastersLoading] = useState<boolean>(false);
  const [mastersError, setMastersError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  const [formData, setFormData] = useState({
    fecha_emision: new Date().toISOString().split('T')[0],
    idTienda: 1,
    idCliente: 1,
    idFormaPago: 1,
    estado_factura: 'Pendiente',
    detalle: '',
    total: 0
  });
  
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrandoForm, setMostrandoForm] = useState(false);
  
  // Estado para confirmación personalizada
  const [confirmacion, setConfirmacion] = useState<{
    mostrar: boolean;
    facturaId: number | null;
    facturaNumero: string;
  }>({ mostrar: false, facturaId: null, facturaNumero: '' });

  // Fetch de facturas
  const fetchFacturas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:4200/api/facturas');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setFacturas(data);
    } catch (err) {
      console.error('Error fetching facturas:', err);
      setError('No se pudo conectar con el backend. Asegúrate de que el servidor esté corriendo en el puerto 4200.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar facturas y datos maestros
  const fetchMasters = useCallback(async () => {
    setMastersLoading(true);
    setMastersError(null);
    try {
      const [tResp, cResp, fResp] = await Promise.all([
        fetch('http://localhost:4200/api/tiendas'),
        fetch('http://localhost:4200/api/clientes'),
        fetch('http://localhost:4200/api/formas_pago/activas')
      ]);

      const tiendasData = tResp.ok ? await tResp.json() : [];
      const clientesData = cResp.ok ? await cResp.json() : [];
      const formasData = fResp.ok ? await fResp.json() : [];

      setTiendas(tiendasData);
      setClientesList(clientesData);
      setFormasPago(formasData);

      // Ajustar valores por defecto si no existen los IDs actuales
      setFormData(prev => ({
        ...prev,
        idTienda: prev.idTienda && tiendasData.some(t => (t.idTienda || t.id) === prev.idTienda) ? prev.idTienda : (tiendasData[0] ? (tiendasData[0].idTienda || tiendasData[0].id) : prev.idTienda),
        idCliente: prev.idCliente && clientesData.some(c => (c.id_cliente || c.id) === prev.idCliente) ? prev.idCliente : (clientesData[0] ? (clientesData[0].id_cliente || clientesData[0].id) : prev.idCliente),
        idFormaPago: prev.idFormaPago && formasData.some(f => (f.id_forma_pago || f.id) === prev.idFormaPago) ? prev.idFormaPago : (formasData[0] ? (formasData[0].id_forma_pago || formasData[0].id) : prev.idFormaPago)
      }));
    } catch (err) {
      console.error('Error fetching master data:', err);
      setMastersError('No se pudieron cargar los datos maestros. Verifica que el backend esté corriendo en el puerto 4200.');
      setTiendas([]);
      setClientesList([]);
      setFormasPago([]);
    } finally {
      setMastersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacturas();
    fetchMasters();
  }, [fetchFacturas, fetchMasters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFormError(null);
      const method = editandoId ? 'PUT' : 'POST';
      const url = editandoId 
        ? `http://localhost:4200/api/facturas/${editandoId}`
        : 'http://localhost:4200/api/facturas';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setMostrandoForm(false);
        setEditandoId(null);
        fetchFacturas(); // Recargar datos
      } else {
        // Intentar leer JSON de error
        const contentType = response.headers.get('content-type') || '';
        let errBody: any = null;
        if (contentType.includes('application/json')) {
          errBody = await response.json();
        } else {
          errBody = await response.text();
        }
        console.error('Server error creando/actualizando factura:', response.status, errBody);
        setFormError(typeof errBody === 'string' ? errBody : (errBody?.error || JSON.stringify(errBody)));
      }
    } catch (err: any) {
      console.error('Error saving factura:', err);
      setFormError(err.message || String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditar = (factura: any) => {
    setFormData({
      fecha_emision: factura.fecha_emision,
      idTienda: factura.idTienda,
      idCliente: factura.idCliente,
      idFormaPago: factura.idFormaPago,
      estado_factura: factura.estado_factura,
      detalle: factura.detalle,
      total: factura.total
    });
    setEditandoId(factura.idFactura);
    setMostrandoForm(true);
  };

  // Toggle personalizado para eliminar
  const handleEliminar = (factura: any) => {
    setConfirmacion({
      mostrar: true,
      facturaId: factura.idFactura,
      facturaNumero: `#${factura.idFactura}` // O usar algún número de factura si existe
    });
  };

  const handleConfirmarEliminacion = async () => {
    if (!confirmacion.facturaId) return;
    
    try {
      const response = await fetch(`http://localhost:4200/api/facturas/${confirmacion.facturaId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchFacturas();
      }
      
      // Cerrar modal
      setConfirmacion({ mostrar: false, facturaId: null, facturaNumero: '' });
    } catch (err) {
      console.error('Error deleting factura:', err);
      // Cerrar modal incluso si hay error
      setConfirmacion({ mostrar: false, facturaId: null, facturaNumero: '' });
    }
  };

  const handleCancelarEliminacion = () => {
    setConfirmacion({ mostrar: false, facturaId: null, facturaNumero: '' });
  };

  const handleCancelar = () => {
    setFormData({
      fecha_emision: new Date().toISOString().split('T')[0],
      idTienda: 1,
      idCliente: 1,
      idFormaPago: 1,
      estado_factura: 'Pendiente',
      detalle: '',
      total: 0
    });
    setEditandoId(null);
    setMostrandoForm(false);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>Gestión de Facturas</h2>
        <p>Cargando facturas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2>Gestión de Facturas</h2>
        <p style={{ color: '#ef4444' }}>{error}</p>
        <button 
          style={styles.primaryButton}
          onClick={fetchFacturas}
        >
          Reintentar Conexión
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Gestión de Facturas</h2>
        
        <button 
          style={styles.primaryButton}
          onClick={() => setMostrandoForm(!mostrandoForm)}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          {mostrandoForm ? 'Cancelar' : 'Nueva Factura'}
        </button>
      </div>

      {mostrandoForm && (
        <div style={styles.formSection}>
          <h3 style={styles.formTitle}>{editandoId ? 'Editar Factura' : 'Nueva Factura'}</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            {mastersError && (
              <div style={{color: '#b91c1c', marginBottom: '10px'}}>
                {mastersError} <button type="button" onClick={fetchMasters} style={{marginLeft: '8px', padding: '6px 10px', borderRadius: '6px'}}>Reintentar</button>
              </div>
            )}
            {formError && (
              <div style={{color: '#b91c1c', marginBottom: '10px'}}>{formError}</div>
            )}
            <div style={styles.formGroup}>
              <label htmlFor="fecha_emision" style={styles.label}>Fecha de Emisión:</label>
              <input
                type="date"
                id="fecha_emision"
                value={formData.fecha_emision}
                onChange={(e) => setFormData({...formData, fecha_emision: e.target.value})}
                required
                style={styles.input}
              />
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="idTienda" style={styles.label}>Tienda:</label>
              <select
                id="idTienda"
                value={formData.idTienda}
                onChange={(e) => setFormData({...formData, idTienda: parseInt(e.target.value) || 0})}
                required
                style={styles.input}
              >
                {mastersLoading ? (
                  <option value={0} disabled>Cargando tiendas...</option>
                ) : (
                  <>
                    <option value={0} disabled>{tiendas.length ? 'Selecciona una tienda' : 'No hay tiendas disponibles'}</option>
                    {tiendas.length === 0 && (
                      <option value={0} disabled>No hay tiendas registradas. Crea una tienda primero.</option>
                    )}
                  </>
                )}
                {tiendas.map(t => (
                  <option key={t.idTienda || t.id} value={t.idTienda || t.id}>{t.nombreTienda || t.nombre || `Tienda ${t.idTienda || t.id}`}</option>
                ))}
              </select>
              {!mastersLoading && tiendas.length === 0 && (
                <div style={{marginTop: '8px', color: '#6b7280'}}>No hay tiendas cargadas. Usa el módulo de Tiendas para crear una.</div>
              )}
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="idCliente" style={styles.label}>Cliente:</label>
              <select
                id="idCliente"
                value={formData.idCliente}
                onChange={(e) => setFormData({...formData, idCliente: parseInt(e.target.value) || 0})}
                required
                style={styles.input}
              >
                <option value={0} disabled>{clientesList.length ? 'Selecciona un cliente' : 'Cargando clientes...'}</option>
                {clientesList.map(c => (
                  <option key={c.id_cliente || c.id} value={c.id_cliente || c.id}>{c.nombre_cliente || c.nombre || `Cliente ${c.id_cliente || c.id}`}</option>
                ))}
              </select>
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="idFormaPago" style={styles.label}>Forma de Pago:</label>
              <select
                id="idFormaPago"
                value={formData.idFormaPago}
                onChange={(e) => setFormData({...formData, idFormaPago: parseInt(e.target.value) || 0})}
                required
                style={styles.input}
              >
                {mastersLoading ? (
                  <option value={0} disabled>Cargando métodos...</option>
                ) : (
                  <>
                    <option value={0} disabled>{formasPago.length ? 'Selecciona forma de pago' : 'No hay métodos disponibles'}</option>
                    {formasPago.length === 0 && (
                      <option value={0} disabled>No hay métodos de pago registrados. Crea uno primero.</option>
                    )}
                  </>
                )}
                {formasPago.map(f => (
                  <option key={f.id_forma_pago || f.id} value={f.id_forma_pago || f.id}>{f.nombre || f.nombre_forma_pago || `Forma ${f.id_forma_pago || f.id}`}</option>
                ))}
              </select>
              {!mastersLoading && formasPago.length === 0 && (
                <div style={{marginTop: '8px', color: '#6b7280'}}>No hay métodos de pago cargados. Ve a Metodos de Pago para crear uno.</div>
              )}
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="estado_factura" style={styles.label}>Estado:</label>
              <select
                id="estado_factura"
                value={formData.estado_factura}
                onChange={(e) => setFormData({...formData, estado_factura: e.target.value})}
                required
                style={styles.input}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Pagada">Pagada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="detalle" style={styles.label}>Detalle:</label>
              <textarea
                id="detalle"
                value={formData.detalle}
                onChange={(e) => setFormData({...formData, detalle: e.target.value})}
                rows={3}
                style={{...styles.input, minHeight: '80px'}}
              />
            </div>
              
            <div style={styles.formGroup}>
              <label htmlFor="total" style={styles.label}>Total:</label>
              <input
                type="number"
                id="total"
                value={formData.total}
                onChange={(e) => setFormData({...formData, total: parseFloat(e.target.value) || 0})}
                min="0"
                step="0.01"
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.formActions}>
              <button 
                type="submit" 
                style={styles.primaryButton}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                disabled={submitting}
              >
                {submitting ? (editandoId ? 'Actualizando...' : 'Guardando...') : (editandoId ? 'Actualizar' : 'Guardar')}
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
        <h3 style={styles.listTitle}>Facturas Registradas ({facturas.length})</h3>
        
        <div style={{overflowX: 'auto'} as React.CSSProperties}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>ID</th>
                <th style={styles.tableHeader}>Fecha</th>
                <th style={styles.tableHeader}>Tienda</th>
                <th style={styles.tableHeader}>Cliente</th>
                <th style={styles.tableHeader}>Forma Pago</th>
                <th style={styles.tableHeader}>Estado</th>
                <th style={styles.tableHeader}>Total</th>
                <th style={styles.tableHeader}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((factura) => {
                // Buscar nombres de entidades relacionadas
                const tienda = tiendas.find(t => (t.idTienda || t.id) === factura.idTienda);
                const cliente = clientesList.find(c => (c.id_cliente || c.id) === factura.idCliente);
                const formaPago = formasPago.find(f => (f.id_forma_pago || f.id) === factura.idFormaPago);
                
                return (
                  <tr key={factura.idFactura}>
                    <td style={styles.tableCell}>{factura.idFactura}</td>
                    <td style={styles.tableCell}>{factura.fecha_emision}</td>
                    <td style={styles.tableCell}>{tienda?.nombreTienda || tienda?.nombre || `Tienda ${factura.idTienda}`}</td>
                    <td style={styles.tableCell}>{cliente?.nombre_cliente || cliente?.nombre || `Cliente ${factura.idCliente}`}</td>
                    <td style={styles.tableCell}>{formaPago?.nombre || formaPago?.nombre_forma_pago || `Forma ${factura.idFormaPago}`}</td>
                    <td style={styles.tableCell}>{factura.estado_factura}</td>
                    <td style={styles.tableCell}>${parseFloat(factura.total || 0).toFixed(2)}</td>
                    <td style={styles.tableCell}>
                      <button 
                        style={{...styles.actionButton, ...styles.editButton}}
                        onClick={() => handleEditar(factura)}
                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        Editar
                      </button>
                      <button 
                        style={{...styles.actionButton, ...styles.deleteButton}}
                        onClick={() => handleEliminar(factura)}
                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {facturas.length === 0 && (
          <div style={{padding: '40px', textAlign: 'center', color: '#64748b'}}>
            <div style={{fontSize: '3rem', marginBottom: '15px'}}>🧾</div>
            <h3>No hay facturas registradas</h3>
            <p>Haz clic en "Nueva Factura" para crear tu primera factura</p>
          </div>
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
              color: '#1e40af',
              marginBottom: '20px',
              fontSize: '20px'
            }}>
              Confirmar Eliminación
            </h3>
            
            <p style={{
              color: '#374151',
              fontSize: '16px',
              marginBottom: '25px',
              lineHeight: '1.5'
            }}>
              ¿Estás seguro de eliminar la factura <strong>{confirmacion.facturaNumero}</strong>? Esta acción no se puede deshacer.
            </p>
            
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center'
            }}>
              <button
                onClick={handleConfirmarEliminacion}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                Eliminar
              </button>
              
              <button
                onClick={handleCancelarEliminacion}
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

export default FacturasAdmin;