import React from 'react';
// 1. Importamos el ViewModel del Cliente
import { useMetodoPagoViewModel } from '../../../presentation/viewmodels/MetodoPagoViewModel'; 
// 2. Importamos la Entidad desde la ruta que usa tu ViewModel
import { MetodoPagoEntity } from '../../../domain/entities/MetodoPago';

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  header: {
    marginBottom: '30px',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '15px',
  },
  title: {
    color: '#1e293b',
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
  },
  subtitle: {
    color: '#64748b',
    marginTop: '5px',
    fontSize: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #895af7',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  methodName: {
    color: '#334155',
    fontSize: '18px',
    fontWeight: '700',
    margin: 0,
  },
  methodCode: {
    fontSize: '12px',
    color: '#94a3b8',
    backgroundColor: '#f8fafc',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px solid #e2e8f0',
  },
  description: {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '20px',
    flex: 1,
  },
  badgesContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
    marginTop: 'auto',
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  badgeDiferido: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    border: '1px solid #dbeafe',
  },
  badgeCuotas: {
    backgroundColor: '#f0fdf4',
    color: '#166534',
    border: '1px solid #bbf7d0',
  },
  loadingContainer: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#64748b',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    color: '#64748b',
    gridColumn: '1 / -1',
  }
};

const MetodosPagoDisponibles: React.FC = () => {
  // 3. USAMOS EL HOOK DEL CLIENTE
  // Extraemos 'metodos' en lugar de 'metodosPago'
  const { metodos, loading, error } = useMetodoPagoViewModel();

  // 4. FILTRADO (Opcional, pero recomendado por seguridad en el frontend)
  // Tipamos explícitamente 'm' con MetodoPagoEntity para evitar "implicit any"
  const metodosDisponibles = metodos.filter((m: MetodoPagoEntity) => m.activo === true);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Cargando métodos de pago...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={{ color: '#ef4444' }}>Ocurrió un error: {error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Métodos de Pago</h2>
        <p style={styles.subtitle}>Seleccione su forma de pago preferida</p>
      </div>

      <div style={styles.grid}>
        {metodosDisponibles.length > 0 ? (
          // Tipamos explícitamente 'metodo' en el map
          metodosDisponibles.map((metodo: MetodoPagoEntity) => (
            <div 
              key={metodo.id} 
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.methodName}>{metodo.nombre}</h3>
                  {/* Si deseas mostrar el código interno: */}
                  {/* <span style={styles.methodCode}>{metodo.codigoInterno}</span> */}
                </div>
              </div>

              <p style={styles.description}>
                {metodo.descripcion}
              </p>

              <div style={styles.badgesContainer}>
                {metodo.permitePagoDiferido && (
                  <div style={{...styles.badge, ...styles.badgeDiferido}}>
                    <span>💳 Diferido</span>
                  </div>
                )}

                {metodo.maximoCuotas > 1 && (
                  <div style={{...styles.badge, ...styles.badgeCuotas}}>
                    <span>Hasta {metodo.maximoCuotas} cuotas</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <h3>No hay métodos de pago disponibles.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetodosPagoDisponibles;