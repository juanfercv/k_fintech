import React, { useState, useEffect } from 'react';
import { ConfiguracionRepositoryImpl } from '../../infrastructure/repositories/ConfiguracionRepositoryImpl';

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
    borderBottom: '2px solid #8b5cf6',
  },
  title: {
    color: '#6d28d9',
    fontSize: '28px',
    fontWeight: '600',
    margin: 0,
  },
  tabs: {
    display: 'flex',
    gap: '5px',
    marginBottom: '25px',
    borderBottom: '1px solid #e5e7eb',
  },
  tabButton: {
    padding: '12px 24px',
    border: 'none',
    backgroundColor: 'transparent',
    borderBottom: '3px solid transparent',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#6b7280',
  },
  tabButtonActive: {
    color: '#8b5cf6',
    borderBottom: '3px solid #8b5cf6',
  },
  tabContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    color: '#1e293b',
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '25px',
    paddingBottom: '10px',
    borderBottom: '1px solid #e2e8f0',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '25px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    marginBottom: '8px',
    fontWeight: '500',
    color: '#374151',
    fontSize: '14px',
  },
  input: {
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'border-color 0.3s ease',
  },
  select: {
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
  },
  buttonPrimary: {
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonSecondary: {
    backgroundColor: '#94a3b8',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginLeft: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '20px',
  },
  tableHeader: {
    backgroundColor: '#f3e8ff',
    padding: '16px',
    textAlign: 'left' as const,
    fontWeight: '600',
    color: '#6d28d9',
    fontSize: '14px',
  },
  tableCell: {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    color: '#334155',
    fontSize: '14px',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  statusActive: {
    backgroundColor: '#ede9fe',
    color: '#5b21b6',
  },
  statusInactive: {
    backgroundColor: '#f3e8ff',
    color: '#7e22ce',
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    border: '1px solid #e2e8f0',
  },
  cardTitle: {
    color: '#1e293b',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
  },
  permissionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  permissionSection: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  permissionTitle: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: '10px',
    fontSize: '14px',
  },
  permissionList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
};

const ConfiguracionGeneral: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'parametros' | 'usuarios' | 'roles' | 'integraciones'>('parametros');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para formularios
  const [parametros, setParametros] = useState({
    moneda: { codigo: 'USD', simbolo: '$', nombre: 'Dólar Estadounidense', decimales: 2 },
    pais: { codigo: 'EC', nombre: 'Ecuador', codigoTelefono: '+593' },
    impuestos: { 
      iva: { porcentaje: 12, activo: true },
      ice: { porcentaje: 0, activo: false },
      retencionFuente: { porcentaje: 1, activo: true }
    },
    formatoDocumentos: {
      prefijoFactura: 'FAC',
      longitudSecuencia: 8,
      incluirAnio: true,
      incluirMes: true,
      separador: '-'
    }
  });

  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombres: 'Admin',
      apellidos: 'Principal',
      email: 'admin@empresa.com',
      username: 'admin',
      rol: 'Administrador General',
      tienda: 'Todas',
      estado: 'activo'
    }
  ]);

  const [roles, setRoles] = useState([
    {
      id: 1,
      nombre: 'Administrador General',
      descripcion: 'Acceso completo al sistema',
      nivel: 1,
      permisos: {
        tiendas: ['leer', 'crear', 'editar', 'eliminar'],
        facturas: ['leer', 'crear', 'editar', 'anular', 'reportes'],
        clientes: ['leer', 'crear', 'editar', 'eliminar'],
        metodosPago: ['leer', 'crear', 'editar', 'eliminar'],
        configuracion: ['leer', 'editar']
      }
    }
  ]);

  const [integraciones, setIntegraciones] = useState([
    {
      id: 1,
      servicio: 'sri',
      nombre: 'Servicio de Rentas Internas',
      configuracion: {
        ambiente: 'pruebas',
        claveAcceso: 'CLAVE_DE_PRUEBAS',
        urlRecepcion: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
        urlAutorizacion: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
        activo: true
      }
    },
    {
      id: 2,
      servicio: 'correo',
      nombre: 'Envío de Facturas por Email',
      configuracion: {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUser: 'facturacion@empresa.com',
        remitente: 'Facturación Empresa',
        activo: true
      }
    }
  ]);

  // Repositorio y carga inicial
  const repository = new ConfiguracionRepositoryImpl();

  useEffect(() => {
    let mounted = true;
    const loadAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const parametrosResp = await repository.getParametros();
        if (mounted && parametrosResp) {
          setParametros(prev => ({
            moneda: parametrosResp.moneda || prev.moneda,
            pais: parametrosResp.pais || prev.pais,
            impuestos: parametrosResp.impuestos || prev.impuestos,
            formatoDocumentos: {
              prefijoFactura: parametrosResp.documentos?.prefijo || prev.formatoDocumentos.prefijoFactura,
              longitudSecuencia: parametrosResp.documentos?.longitud || prev.formatoDocumentos.longitudSecuencia,
              incluirAnio: parametrosResp.documentos?.incluir_anio ?? prev.formatoDocumentos.incluirAnio,
              incluirMes: parametrosResp.documentos?.incluir_mes ?? prev.formatoDocumentos.incluirMes,
              separador: parametrosResp.documentos?.separador ?? prev.formatoDocumentos.separador,
            }
          }));
        }

        const [usuariosResp, rolesResp, integracionesResp] = await Promise.all([
          repository.getUsuarios().catch(() => null),
          repository.getRoles().catch(() => null),
          repository.getIntegraciones().catch(() => null),
        ]);

        if (mounted) {
          if (usuariosResp) setUsuarios(usuariosResp);
          if (rolesResp) setRoles(rolesResp);
          if (integracionesResp) setIntegraciones(integracionesResp);
        }
      } catch (err) {
        if (mounted) setError('Error cargando configuración: ' + (err as Error).message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAll();
    return () => { mounted = false; };
  }, []);

  const handleSaveParametros = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const repository = new ConfiguracionRepositoryImpl();
      const parametrosParaGuardar = {
        moneda: parametros.moneda,
        pais: parametros.pais,
        impuestos: parametros.impuestos,
        documentos: {
          prefijo: parametros.formatoDocumentos.prefijoFactura,
          longitud: parametros.formatoDocumentos.longitudSecuencia,
          incluir_anio: parametros.formatoDocumentos.incluirAnio,
          incluir_mes: parametros.formatoDocumentos.incluirMes,
          separador: parametros.formatoDocumentos.separador
        }
      };
      
      await repository.updateParametros(parametrosParaGuardar);
      alert('Parámetros generales guardados exitosamente');
    } catch (error) {
      setError('Error al guardar parámetros: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const renderParametrosTab = () => (
    <div style={styles.tabContent}>
      <h3 style={styles.sectionTitle}>Parámetros Generales del Sistema</h3>
      
      <div style={styles.card}>
        <h4 style={styles.cardTitle}>Moneda y País</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label htmlFor="monedaCodigo" style={styles.label}>Código de Moneda:</label>
            <select
              id="monedaCodigo"
              value={parametros.moneda.codigo}
              onChange={(e) => setParametros({
                ...parametros,
                moneda: {...parametros.moneda, codigo: e.target.value}
              })}
              style={styles.select}
            >
              <option value="USD">USD - Dólar Estadounidense</option>
              <option value="EUR">EUR - Euro</option>
              <option value="COP">COP - Peso Colombiano</option>
              <option value="MXN">MXN - Peso Mexicano</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="monedaSimbolo" style={styles.label}>Símbolo:</label>
            <input
              type="text"
              id="monedaSimbolo"
              value={parametros.moneda.simbolo}
              onChange={(e) => setParametros({
                ...parametros,
                moneda: {...parametros.moneda, simbolo: e.target.value}
              })}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="paisCodigo" style={styles.label}>País:</label>
            <select
              id="paisCodigo"
              value={parametros.pais.codigo}
              onChange={(e) => setParametros({
                ...parametros,
                pais: {...parametros.pais, codigo: e.target.value}
              })}
              style={styles.select}
            >
              <option value="EC">Ecuador</option>
              <option value="CO">Colombia</option>
              <option value="MX">México</option>
              <option value="ES">España</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="paisTelefono" style={styles.label}>Código Telefónico:</label>
            <input
              type="text"
              id="paisTelefono"
              value={parametros.pais.codigoTelefono}
              onChange={(e) => setParametros({
                ...parametros,
                pais: {...parametros.pais, codigoTelefono: e.target.value}
              })}
              style={styles.input}
            />
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h4 style={styles.cardTitle}>Reglas de Impuestos</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>IVA (%):</label>
            <input
              type="number"
              value={parametros.impuestos.iva.porcentaje}
              onChange={(e) => setParametros({
                ...parametros,
                impuestos: {
                  ...parametros.impuestos,
                  iva: {...parametros.impuestos.iva, porcentaje: parseFloat(e.target.value) || 0}
                }
              })}
              style={styles.input}
            />
            <div style={{...styles.checkboxGroup, marginTop: '8px'}}>
              <input
                type="checkbox"
                checked={parametros.impuestos.iva.activo}
                onChange={(e) => setParametros({
                  ...parametros,
                  impuestos: {
                    ...parametros.impuestos,
                    iva: {...parametros.impuestos.iva, activo: e.target.checked}
                  }
                })}
                style={styles.checkbox}
              />
              <label style={{fontSize: '14px', color: '#374151'}}>IVA Activo</label>
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>ICE (%):</label>
            <input
              type="number"
              value={parametros.impuestos.ice.porcentaje}
              onChange={(e) => setParametros({
                ...parametros,
                impuestos: {
                  ...parametros.impuestos,
                  ice: {...parametros.impuestos.ice, porcentaje: parseFloat(e.target.value) || 0}
                }
              })}
              style={styles.input}
            />
            <div style={{...styles.checkboxGroup, marginTop: '8px'}}>
              <input
                type="checkbox"
                checked={parametros.impuestos.ice.activo}
                onChange={(e) => setParametros({
                  ...parametros,
                  impuestos: {
                    ...parametros.impuestos,
                    ice: {...parametros.impuestos.ice, activo: e.target.checked}
                  }
                })}
                style={styles.checkbox}
              />
              <label style={{fontSize: '14px', color: '#374151'}}>ICE Activo</label>
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Retención Fuente (%):</label>
            <input
              type="number"
              value={parametros.impuestos.retencionFuente.porcentaje}
              onChange={(e) => setParametros({
                ...parametros,
                impuestos: {
                  ...parametros.impuestos,
                  retencionFuente: {...parametros.impuestos.retencionFuente, porcentaje: parseFloat(e.target.value) || 0}
                }
              })}
              style={styles.input}
            />
            <div style={{...styles.checkboxGroup, marginTop: '8px'}}>
              <input
                type="checkbox"
                checked={parametros.impuestos.retencionFuente.activo}
                onChange={(e) => setParametros({
                  ...parametros,
                  impuestos: {
                    ...parametros.impuestos,
                    retencionFuente: {...parametros.impuestos.retencionFuente, activo: e.target.checked}
                  }
                })}
                style={styles.checkbox}
              />
              <label style={{fontSize: '14px', color: '#374151'}}>Retención Activa</label>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h4 style={styles.cardTitle}>Formato de Numeración de Documentos</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label htmlFor="prefijoFactura" style={styles.label}>Prefijo Factura:</label>
            <input
              type="text"
              id="prefijoFactura"
              value={parametros.formatoDocumentos.prefijoFactura}
              onChange={(e) => setParametros({
                ...parametros,
                formatoDocumentos: {...parametros.formatoDocumentos, prefijoFactura: e.target.value}
              })}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="longitudSecuencia" style={styles.label}>Longitud Secuencia:</label>
            <input
              type="number"
              id="longitudSecuencia"
              value={parametros.formatoDocumentos.longitudSecuencia}
              onChange={(e) => setParametros({
                ...parametros,
                formatoDocumentos: {...parametros.formatoDocumentos, longitudSecuencia: parseInt(e.target.value) || 8}
              })}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="separador" style={styles.label}>Separador:</label>
            <select
              id="separador"
              value={parametros.formatoDocumentos.separador}
              onChange={(e) => setParametros({
                ...parametros,
                formatoDocumentos: {...parametros.formatoDocumentos, separador: e.target.value}
              })}
              style={styles.select}
            >
              <option value="-">Guion (-)</option>
              <option value="/">Barra (/)</option>
              <option value=".">Punto (.)</option>
              <option value="">Ninguno</option>
            </select>
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '20px', marginTop: '15px'}}>
          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              checked={parametros.formatoDocumentos.incluirAnio}
              onChange={(e) => setParametros({
                ...parametros,
                formatoDocumentos: {...parametros.formatoDocumentos, incluirAnio: e.target.checked}
              })}
              style={styles.checkbox}
            />
            <label style={{fontSize: '14px', color: '#374151'}}>Incluir Año</label>
          </div>
          
          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              checked={parametros.formatoDocumentos.incluirMes}
              onChange={(e) => setParametros({
                ...parametros,
                formatoDocumentos: {...parametros.formatoDocumentos, incluirMes: e.target.checked}
              })}
              style={styles.checkbox}
            />
            <label style={{fontSize: '14px', color: '#374151'}}>Incluir Mes</label>
          </div>
        </div>
      </div>

      <div style={{textAlign: 'right', marginTop: '30px'}}>
        <button 
          style={styles.buttonPrimary}
          onClick={handleSaveParametros}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  );

  const renderUsuariosTab = () => (
    <div style={styles.tabContent}>
      <h3 style={styles.sectionTitle}>Gestión de Usuarios</h3>
      
      <div style={{overflowX: 'auto'} as React.CSSProperties}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Nombre</th>
              <th style={styles.tableHeader}>Email</th>
              <th style={styles.tableHeader}>Rol</th>
              <th style={styles.tableHeader}>Tienda</th>
              <th style={styles.tableHeader}>Estado</th>
              <th style={styles.tableHeader}>Último Login</th>
              <th style={styles.tableHeader}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td style={styles.tableCell}>{usuario.nombres} {usuario.apellidos}</td>
                <td style={styles.tableCell}>{usuario.email}</td>
                <td style={styles.tableCell}>{usuario.rol}</td>
                <td style={styles.tableCell}>{usuario.tienda}</td>
                <td style={styles.tableCell}>
                  <span style={{
                    ...styles.statusBadge,
                    ...(usuario.estado === 'activo' ? styles.statusActive : styles.statusInactive)
                  }}>
                    {usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={styles.tableCell}>-</td>
                <td style={styles.tableCell}>
                  <button style={{...styles.buttonPrimary, padding: '6px 12px', fontSize: '14px'}}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{textAlign: 'center', marginTop: '20px'}}>
        <button style={styles.buttonPrimary}>
          Nuevo Usuario
        </button>
      </div>
    </div>
  );

  const renderRolesTab = () => (
    <div style={styles.tabContent}>
      <h3 style={styles.sectionTitle}>Gestión de Roles y Permisos</h3>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px'}}>
        {roles.map(rol => (
          <div key={rol.id} style={styles.card}>
            <h4 style={styles.cardTitle}>{rol.nombre}</h4>
            <p style={{color: '#64748b', marginBottom: '15px'}}>{rol.descripcion}</p>
            <p style={{fontWeight: '500', marginBottom: '15px'}}>Nivel: {rol.nivel}</p>
            
            <div style={styles.permissionGrid}>
              <div style={styles.permissionSection}>
                <div style={styles.permissionTitle}>Tiendas</div>
                <div style={styles.permissionList}>
                  {rol.permisos.tiendas.map(permiso => (
                    <span key={permiso} style={{fontSize: '12px', backgroundColor: '#ede9fe', padding: '4px 8px', borderRadius: '4px'}}>
                      {permiso}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={styles.permissionSection}>
                <div style={styles.permissionTitle}>Facturas</div>
                <div style={styles.permissionList}>
                  {rol.permisos.facturas.map(permiso => (
                    <span key={permiso} style={{fontSize: '12px', backgroundColor: '#ede9fe', padding: '4px 8px', borderRadius: '4px'}}>
                      {permiso}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={styles.permissionSection}>
                <div style={styles.permissionTitle}>Clientes</div>
                <div style={styles.permissionList}>
                  {rol.permisos.clientes.map(permiso => (
                    <span key={permiso} style={{fontSize: '12px', backgroundColor: '#ede9fe', padding: '4px 8px', borderRadius: '4px'}}>
                      {permiso}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={styles.permissionSection}>
                <div style={styles.permissionTitle}>Métodos Pago</div>
                <div style={styles.permissionList}>
                  {rol.permisos.metodosPago.map(permiso => (
                    <span key={permiso} style={{fontSize: '12px', backgroundColor: '#ede9fe', padding: '4px 8px', borderRadius: '4px'}}>
                      {permiso}
                    </span>
                  ))}
                </div>
              </div>
              
              {rol.permisos.configuracion && (
                <div style={styles.permissionSection}>
                  <div style={styles.permissionTitle}>Configuración</div>
                  <div style={styles.permissionList}>
                    {rol.permisos.configuracion.map(permiso => (
                      <span key={permiso} style={{fontSize: '12px', backgroundColor: '#ede9fe', padding: '4px 8px', borderRadius: '4px'}}>
                        {permiso}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div style={{textAlign: 'center', marginTop: '20px'}}>
              <button style={{...styles.buttonPrimary, padding: '8px 16px', fontSize: '14px'}}>
                Editar Rol
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{textAlign: 'center', marginTop: '30px'}}>
        <button style={styles.buttonPrimary}>
          Nuevo Rol
        </button>
      </div>
    </div>
  );

  const renderIntegracionesTab = () => (
    <div style={styles.tabContent}>
      <h3 style={styles.sectionTitle}>Integraciones Externas</h3>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px'}}>
        {integraciones.map(int => (
          <div key={int.id} style={styles.card}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
              <h4 style={styles.cardTitle}>{int.nombre}</h4>
              <span style={{
                ...styles.statusBadge,
                ...(int.configuracion.activo ? styles.statusActive : styles.statusInactive)
              }}>
                {int.configuracion.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            
            <p style={{color: '#64748b', marginBottom: '15px', textTransform: 'uppercase', fontWeight: '600', fontSize: '14px'}}>
              Servicio: {int.servicio}
            </p>
            
            {int.servicio === 'sri' && (
              <div style={{display: 'grid', gap: '10px'}}>
                <div>
                  <label style={styles.label}>Ambiente:</label>
                  <select value={int.configuracion.ambiente} style={styles.select}>
                    <option value="pruebas">Pruebas</option>
                    <option value="produccion">Producción</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Clave de Acceso:</label>
                  <input 
                    type="password" 
                    value={int.configuracion.claveAcceso || ''} 
                    style={styles.input}
                    placeholder="Ingrese clave de acceso SRI"
                  />
                </div>
                <div>
                  <label style={styles.label}>URL Recepción:</label>
                  <input 
                    type="text" 
                    value={int.configuracion.urlRecepcion || ''} 
                    style={styles.input}
                  />
                </div>
              </div>
            )}
            
            {int.servicio === 'correo' && (
              <div style={{display: 'grid', gap: '10px'}}>
                <div>
                  <label style={styles.label}>SMTP Host:</label>
                  <input 
                    type="text" 
                    value={int.configuracion.smtpHost || ''} 
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>SMTP Puerto:</label>
                  <input 
                    type="number" 
                    value={int.configuracion.smtpPort || ''} 
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Usuario SMTP:</label>
                  <input 
                    type="text" 
                    value={int.configuracion.smtpUser || ''} 
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Remitente:</label>
                  <input 
                    type="text" 
                    value={int.configuracion.remitente || ''} 
                    style={styles.input}
                  />
                </div>
              </div>
            )}
            
            <div style={{display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end'}}>
              <button style={{...styles.buttonSecondary, padding: '8px 16px', fontSize: '14px'}}>
                Probar Conexión
              </button>
              <button style={{...styles.buttonPrimary, padding: '8px 16px', fontSize: '14px'}}>
                Guardar
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{textAlign: 'center', marginTop: '30px'}}>
        <button style={styles.buttonPrimary}>
          Nueva Integración
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Configuración General del Sistema</h2>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <span style={{fontSize: '14px', color: '#64748b'}}>Última actualización: Hoy</span>
        </div>
      </div>

      {error && (
        <div style={{backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '20px'}}>
          {error}
        </div>
      )}

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'parametros' ? styles.tabButtonActive : {})
          }}
          onClick={() => setActiveTab('parametros')}
        >
          📊 Parámetros Generales
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'usuarios' ? styles.tabButtonActive : {})
          }}
          onClick={() => setActiveTab('usuarios')}
        >
          👥 Usuarios
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'roles' ? styles.tabButtonActive : {})
          }}
          onClick={() => setActiveTab('roles')}
        >
          🔐 Roles y Permisos
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'integraciones' ? styles.tabButtonActive : {})
          }}
          onClick={() => setActiveTab('integraciones')}
        >
          🔌 Integraciones
        </button>
      </div>

      {activeTab === 'parametros' && renderParametrosTab()}
      {activeTab === 'usuarios' && renderUsuariosTab()}
      {activeTab === 'roles' && renderRolesTab()}
      {activeTab === 'integraciones' && renderIntegracionesTab()}
    </div>
  );
};

export default ConfiguracionGeneral;