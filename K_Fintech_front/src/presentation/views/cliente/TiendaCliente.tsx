import React, { useEffect, useState } from 'react';
import type { Tienda } from '../../../domain/entities/Tienda';
import { TiendaRepositoryImpl } from '../../../infrastructure/repositories/TiendaRepositoryImpl';
import { GetTiendasUseCase } from '../../../domain/usecases/tienda/GetTiendaUseCase';

// Inicialización de la arquitectura limpia
const repo = new TiendaRepositoryImpl();
const getTiendas = new GetTiendasUseCase(repo);

const TiendasCliente: React.FC = () => {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Obtenemos todas las tiendas
    getTiendas.execute()
      .then((data) => {
        setTiendas(data);
      })
      .catch((err) => {
        console.error(err);
        setError('No se pudieron cargar las tiendas. Intente más tarde.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={styles.centerContainer}>
      <div style={styles.loader}>Cargando catálogo de tiendas...</div>
    </div>
  );

  if (error) return (
    <div style={styles.centerContainer}>
      <p style={{ ...styles.message, color: '#ef4444' }}>{error}</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Nuestras Tiendas</h2>
        <p style={styles.subtitle}>Encuentra la sucursal más cercana a ti</p>
      </div>

      {tiendas.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={{ fontSize: '40px' }}>🏪</span>
          <p>No hay tiendas disponibles en este momento.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {tiendas.map((tienda) => (
            <div key={tienda.idTienda} style={styles.card}>
              
              {/* Cabecera de la tarjeta: Imagen y Estado */}
              <div style={styles.cardHeader}>
                {tienda.fotoTienda ? (
                  <img 
                    src={tienda.fotoTienda} 
                    alt={tienda.nombreTienda} 
                    style={styles.cardImage} 
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                ) : (
                  <div style={styles.placeholderImage}>
                    <span>🏢</span>
                  </div>
                )}
                
                {/* ETIQUETA DE ESTADO SOLICITADA */}
                <div style={{
                  ...styles.statusBadge,
                  ...(tienda.estado === 'activa' ? styles.statusActive : styles.statusInactive)
                }}>
                  {tienda.estado === 'activa' ? 'Abierto / Activa' : 'Cerrado / Desactivada'}
                </div>
              </div>

              {/* Cuerpo de la tarjeta */}
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{tienda.nombreTienda}</h3>
                <p style={styles.cardOwner}>De: {tienda.dueñoTienda}</p>
                
                <div style={styles.divider}></div>

                <div style={styles.infoList}>
                  <InfoItem icon="📍" text={tienda.ciudad || 'Ciudad no especificada'} />
                  <InfoItem icon="🏠" text={tienda.dirección_matriz_tienda} />
                  {tienda.direccion_sucursal_tienda && (
                    <InfoItem icon="🏢" text={`Sucursal: ${tienda.direccion_sucursal_tienda}`} />
                  )}
                  <InfoItem icon="📞" text={tienda.telefono} />
                  <InfoItem icon="✉️" text={tienda.correo_electronico_tienda} />
                  <InfoItem icon="🆔" text={`RUC: ${tienda.RUCTienda}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente auxiliar para filas de información
const InfoItem = ({ icon, text }: { icon: string; text: string }) => (
  <div style={styles.infoItem}>
    <span style={styles.infoIcon}>{icon}</span>
    <span style={styles.infoText}>{text}</span>
  </div>
);

// 🎨 ESTILOS CSS-IN-JS
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  centerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    fontFamily: '"Segoe UI", sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    color: '#1e293b',
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0 0 10px 0',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '1.1rem',
  },
  loader: {
    color: '#3b82f6',
    fontSize: '1.2rem',
    fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '30px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    height: '160px',
    backgroundColor: '#f1f5f9',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderImage: {
    fontSize: '4rem',
    opacity: 0.3,
  },
  // Estilos para el Badge de Estado
  statusBadge: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(4px)',
  },
  statusActive: {
    backgroundColor: 'rgba(220, 252, 231, 0.95)', // Verde claro
    color: '#166534',
    border: '1px solid #86efac',
  },
  statusInactive: {
    backgroundColor: 'rgba(254, 226, 226, 0.95)', // Rojo claro
    color: '#991b1b',
    border: '1px solid #fca5a5',
  },
  cardBody: {
    padding: '25px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    margin: '0 0 5px 0',
    fontSize: '1.4rem',
    color: '#0f172a',
    fontWeight: '700',
  },
  cardOwner: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#64748b',
    fontStyle: 'italic',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '15px 0',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '0.95rem',
    color: '#334155',
    lineHeight: '1.4',
  },
  infoIcon: {
    fontSize: '1.1rem',
    minWidth: '24px',
  },
  infoText: {
    wordBreak: 'break-word',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    color: '#94a3b8',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '2px dashed #cbd5e1',
  },
  message: {
    fontSize: '1.1rem',
    textAlign: 'center',
  }
};

export default TiendasCliente;