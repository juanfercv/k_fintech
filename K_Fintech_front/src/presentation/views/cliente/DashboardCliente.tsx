import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { facturaService, clienteService, tiendaService, metodoPagoService } from "../../../services/api";

import type { Factura } from "../../../domain/entities/Factura";
import type { Cliente } from "../../../domain/entities/Cliente";
import type { Tienda } from "../../../domain/entities/Tienda";
import { MetodoPagoEntity } from "../../../domain/entities/MetodoPago";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [metodosPago, setMetodosPago] = useState<MetodoPagoEntity[]>([]);
  const navigate = useNavigate();

  const totalFacturado = facturas.reduce(
    (sum, f) => sum + (f.total || 0),
    0
  );

  const facturasEmitidas = facturas.length;
  const clientesRegistrados = clientes.length;
  const metodosPagoDisponibles = metodosPago.length;

  useEffect(() => {
    Promise.all([
      facturaService.getAll(),
      clienteService.getAll(),
      tiendaService.getAll(),
      metodoPagoService.getAll()
    ])
      .then(([facturasData, clientesData, tiendasData, formasPagoData]) => {
        setFacturas(facturasData ?? []);
        setClientes(clientesData ?? []);
        // Mapear respuesta API (tipo services/api.Tienda) al tipo de dominio `Tienda`
        const mapTienda = (t: any) => ({
          idTienda: t.idTienda,
          fotoTienda: t.fotoTienda,
          nombreTienda: t.nombreTienda,
          dueñoTienda: t.dueñoTienda,
          RUCTienda: t.RUCTienda,
          dirección_matriz_tienda: t.dirección_matriz_tienda,
          direccion_sucursal_tienda: t.direccion_sucursal_tienda,
          correo_electronico_tienda: t.correo_electronico_tienda,
          telefono: t.telefono,
          // `estado` puede venir con otro nombre o faltar; normalizamos
          estado: t.estado || (t.activo ? 'activa' : 'inactiva') || 'activa',
          codigoPuntoEmision: t.codigoPuntoEmision,
          ciudad: t.ciudad,
          configuracionFacturacion: t.configuracionFacturacion
        });

        setTiendas((tiendasData ?? []).map(mapTienda));
        // Mapear métodos a entidad si tu backend no devuelve igual
        setMetodosPago((formasPagoData ?? []).map(MetodoPagoEntity.fromBackend));
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo cargar el dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={styles.msg}>Cargando datos...</p>;
  if (error) return <p style={{ ...styles.msg, color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Visión rápida — métricas clave y accesos directos</p>
        </div>

        <div style={styles.headerActions}>
          <button style={styles.primaryAction} onClick={() => navigate('/nueva-factura')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 8 }}>
              <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Crear nueva factura
          </button>
        </div>
      </header>

      <div style={styles.grid}>
        <Card label="Total facturado" value={`$ ${totalFacturado.toFixed(2)}`} icon="money" />
        <Card label="Facturas emitidas" value={facturasEmitidas} icon="invoices" />
        <Card label="Clientes registrados" value={clientesRegistrados} icon="users" />
        <Card label="Métodos de pago" value={metodosPagoDisponibles} icon="cards" />
      </div>

      <section style={styles.shortcutsSection}>
        <h3 style={{ margin: 0, marginBottom: 10 }}>Accesos rápidos</h3>
        <div style={styles.shortcutsGrid}>
          <button style={styles.shortcutBtn} onClick={() => navigate('/facturas')}> Listado de facturas</button>
          <button style={styles.shortcutBtn} onClick={() => navigate('/cliente')}> Clientes</button>
          <button style={styles.shortcutBtn} onClick={() => navigate('/tienda')}> Tiendas</button>
        </div>
      </section>
    </div>
  );
};

const Card = ({ label, value, icon }: { label: string; value: string | number; icon?: string }) => (
  <div style={styles.card}>
    <div style={styles.cardTop}>
      <div style={styles.iconCircle} aria-hidden>
        {icon === 'money' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1v22" stroke="#0b76ff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M17 5H9a3 3 0 000 6h6a3 3 0 110 6H7" stroke="#0b76ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {icon === 'invoices' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V6a2 2 0 00-2-2H7L3 6v9a2 2 0 002 2h14a2 2 0 002-2z" stroke="#0b76ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 10h8M7 14h4" stroke="#0b76ff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {icon === 'users' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" stroke="#0b76ff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#0b76ff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {icon === 'cards' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="#0b76ff" strokeWidth="1.5" />
            <path d="M2 10h20" stroke="#0b76ff" strokeWidth="1.2" />
          </svg>
        )}
      </div>
      <p style={styles.cardLabel}>{label}</p>
    </div>
    <p style={styles.cardValue}>{value}</p>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: 20,
    fontFamily: "system-ui, sans-serif",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 600,
    marginBottom: 24,
  },
  msg: {
    textAlign: "center",
    padding: 20,
    fontSize: "1.1rem"
  },
  grid: {
    display: "grid",
    gap: 20,
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    border: "1px solid #824ffc",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    transition: "transform .12s, box-shadow .12s",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 110,
  },

  cardValue: {
    fontSize: "1.5rem",
    fontWeight: 700,
    marginTop: 8,
    lineHeight: '1.1',
  },
  button: {
    display: "block",
    padding: "14px 22px",
    fontSize: "1rem",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    margin: "0 auto",
    transition: "background .2s, transform .1s",
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  subtitle: { marginTop: 4, color: '#6b7280' },
  headerActions: { display: 'flex', gap: 10, alignItems: 'center' },
  primaryAction: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#0b76ff', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' },
  cardTop: { display: 'flex', alignItems: 'center', gap: 12, minHeight: 52 },
  iconCircle: { width: 44, height: 44, borderRadius: 10, background: '#eef6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardLabel: { opacity: 0.7, marginBottom: 0, fontSize: 13, lineHeight: '1.2' },
  shortcutsSection: { marginTop: 18 },
  shortcutsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 },
  shortcutBtnPrimary: { padding: '10px 12px', background: '#06b6d4', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' },
  shortcutBtn: { padding: '10px 12px', background: '#1158f0', color: '#ffffff', border: '1px solid #e6eef6', borderRadius: 8, cursor: 'pointer' }
};

export default Dashboard;
