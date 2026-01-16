import React, { useEffect, useState } from 'react';
import type { Tienda } from '../../../domain/entities/Tienda';
import { TiendaRepositoryImpl } from '../../../infrastructure/repositories/TiendaRepositoryImpl';
import { GetTiendasUseCase } from '../../../domain/usecases/tienda/GetTiendaUseCase';

const repo = new TiendaRepositoryImpl();
const getTiendas = new GetTiendasUseCase(repo);

const TiendasCliente: React.FC = () => {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTiendas.execute()
      .then(setTiendas)
      .catch(() => setError('No se pudieron cargar las tiendas'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={styles.message}>Cargando tiendas...</p>;
  if (error) return <p style={{ ...styles.message, color: 'red' }}>{error}</p>;
  if (tiendas.length === 0) return <p style={styles.message}>No hay tiendas registradas</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Tiendas Registradas</h2>

      <div style={styles.list}>
        {tiendas.map((tienda) => (
          <div key={tienda.idTienda} style={styles.card}>
            <Info label="Nombre comercial" value={tienda.nombreTienda} />
            <Info label="RUC" value={tienda.RUCTienda} />
            <Info label="Matriz" value={tienda.dirección_matriz_tienda} />
            <Info label="Sucursal" value={tienda.direccion_sucursal_tienda || 'N/A'} />
            <Info label="Dueño" value={tienda.dueñoTienda} />
            <Info label="Correo" value={tienda.correo_electronico_tienda} />
            <Info label="Teléfono" value={tienda.telefono} />
            <Info label="Ciudad" value={tienda.ciudad || 'No definida'} />
            <Info label="Estado" value={tienda.estado} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div style={styles.infoRow}>
    <span style={styles.label}>{label}:</span>
    <span style={styles.value}>{value}</span>
  </div>
);

// 🎨 Estilos centralizados (estándar recomendado)
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 900,
    margin: '0 auto',
    padding: 20,
  },
  title: {
    marginBottom: 20,
    fontWeight: 600,
    fontSize: '1.6rem',
  },
  message: {
    textAlign: 'center',
    padding: 20,
    fontSize: '1.1rem',
  },
  list: {
    display: 'grid',
    gap: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
    transition: 'transform .1s ease-in-out',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0',
  },
  label: {
    fontWeight: 600,
  },
  value: {
    opacity: 0.85,
  },
};

export default TiendasCliente;
