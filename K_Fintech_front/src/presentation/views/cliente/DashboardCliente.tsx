import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { facturaService, clienteService, tiendaService, metodoPagoService } from "../../../services/api";

// Importamos Factura y la usamos para definir un tipo extendido
import type { Factura } from "../../../domain/entities/Factura";
import type { Cliente } from "../../../domain/entities/Cliente";
import type { Tienda } from "../../../domain/entities/Tienda";
import { MetodoPagoEntity } from "../../../domain/entities/MetodoPago";

// CORRECCIÓN 1: Extendemos la interfaz Factura para incluir 'totalReal'
// Esto soluciona que "Factura" no se usaba y tipa correctamente el estado.
type FacturaDashboard = Factura & { totalReal?: number; [key: string]: any };

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Usamos el nuevo tipo aquí
  const [facturas, setFacturas] = useState<FacturaDashboard[]>([]); 
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [metodosPago, setMetodosPago] = useState<MetodoPagoEntity[]>([]);
  const [totalReal, setTotalReal] = useState<number>(0);

  const navigate = useNavigate();

  // --- 1. PREPARACIÓN DE DATOS PARA GRÁFICAS ---
  const chartData = useMemo(() => {
    if (facturas.length === 0) return null;

    // A) ACUMULADO
    // Ordenamos por fecha. (f as any) nos protege si fecha_emision no existe en el tipo estricto
    const sorted = [...facturas].sort((a, b) => 
      new Date((a as any).fecha_emision).getTime() - new Date((b as any).fecha_emision).getTime()
    );
    
    let acumulado = 0;
    const dataAcumulada = sorted.map(f => {
      acumulado += (f.totalReal || 0);
      return { fecha: (f as any).fecha_emision, valor: acumulado };
    });

    // B) TOP CLIENTES (Barras)
    const porCliente: Record<number, number> = {};
    facturas.forEach(f => {
       // Protegemos el acceso a idCliente e idFormaPago con (f as any) por si tu interfaz varía
       const idC = (f as any).idCliente || f.idCliente;
       porCliente[idC] = (porCliente[idC] || 0) + (f.totalReal || 0);
    });
    
    const dataClientes = Object.keys(porCliente).map(id => {
       // CORRECCIÓN 2: Casting a 'any' para buscar id o id_cliente sin errores
       const cliente = clientes.find((c: any) => (c.id_cliente || c.id) === Number(id));
       
       // CORRECCIÓN 2: Casting a 'any' para leer 'nombre' si 'nombre_cliente' no existe
       const nombre = cliente 
        ? ((cliente as any).nombre_cliente || (cliente as any).nombre) 
        : `ID ${id}`;

       return { 
         label: nombre, 
         value: porCliente[Number(id)] 
       };
    }).sort((a, b) => b.value - a.value).slice(0, 5);

    return { dataAcumulada, dataClientes };
  }, [facturas, clientes]);

  // --- 2. CARGA DE DATOS ---
  useEffect(() => {
    Promise.all([
      facturaService.getAll(),
      clienteService.getAll(),
      tiendaService.getAll(),
      metodoPagoService.getAll()
    ])
      .then(async ([resFacturas, resClientes, resTiendas, resPagos]) => {
        const extraerArray = (res: any) => Array.isArray(res) ? res : (res?.data || []);
        
        const listaFacturas = extraerArray(resFacturas);
        
        const promesas = listaFacturas.map(async (f: any) => {
           try {
             const r = await fetch(`/api/facturas/${f.idFactura || f.id}`);
             const d = await r.json();
             const items = d.detalle_facturas || d.detalles || [];
             const sum = items.reduce((acc: number, i: any) => acc + (Number(i.precio_total)||0), 0);
             const real = sum > 0 ? sum : (Number(d.total)||0);
             return { ...f, totalReal: real };
           } catch { return { ...f, totalReal: 0 }; }
        });
        
        const facturasCompletas = await Promise.all(promesas);
        setFacturas(facturasCompletas);
        setTotalReal(facturasCompletas.reduce((acc, curr) => acc + (curr.totalReal || 0), 0));

        setClientes(extraerArray(resClientes));
        
        const listaTiendas = extraerArray(resTiendas);
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
            estado: t.estado || (t.activo ? 'activa' : 'inactiva') || 'activa',
            codigoPuntoEmision: t.codigoPuntoEmision,
            ciudad: t.ciudad,
            configuracionFacturacion: t.configuracionFacturacion
        });
        setTiendas(listaTiendas.map(mapTienda));

        const rawPagos = extraerArray(resPagos);
        setMetodosPago(rawPagos.map(MetodoPagoEntity.fromBackend));
      })
      .catch(err => { console.error(err); setError("Error cargando datos"); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={styles.msg}>Cargando datos...</p>;
  if (error) return <p style={{ ...styles.msg, color: "red" }}>{error}</p>;

  const cantidadFacturas = facturas.length;
  const cantidadClientes = clientes.length;
  const cantidadTiendas = tiendas.length;
  const cantidadMetodos = metodosPago.length;

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

      {/* TARJETAS KPI */}
      <div style={styles.grid}>
        <Card label="Total facturado (Real)" value={`$ ${totalReal.toFixed(2)}`} icon="money" />
        <Card label="Facturas emitidas" value={cantidadFacturas} icon="invoices" />
        <Card label="Clientes registrados" value={cantidadClientes} icon="users" />
        <Card label="Tiendas activas" value={cantidadTiendas} icon="store" />
        <Card label="Métodos de pago" value={cantidadMetodos} icon="cards" />
      </div>

      {/* SECCIÓN DE GRÁFICAS */}
      <div style={styles.chartsGrid}>
        
        {/* Gráfica 1: Crecimiento Acumulado */}
        <div style={styles.card}> 
           <h3 style={styles.chartTitle}>Ingresos Acumulados</h3>
           {chartData?.dataAcumulada && chartData.dataAcumulada.length > 0 ? (
             <AccumulatedAreaChart data={chartData.dataAcumulada} height={180} />
           ) : <p style={styles.noData}>Sin datos</p>}
        </div>

        {/* Gráfica 2: Top Clientes */}
        <div style={styles.card}>
           <h3 style={styles.chartTitle}>Top 5 Clientes</h3>
           {chartData?.dataClientes && chartData.dataClientes.length > 0 ? (
             <HorizontalBarChart data={chartData.dataClientes} />
           ) : <p style={styles.noData}>Sin datos</p>}
        </div>

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

// =====================================================================
// COMPONENTES DE GRÁFICAS
// =====================================================================

const AccumulatedAreaChart = ({ data, height }: { data: {fecha: string, valor: number}[], height: number }) => {
  const maxVal = Math.max(...data.map(d => d.valor));
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.valor / maxVal) * 100);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ width: '100%', height: height, position: 'relative' }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <polygon points={`0,100 ${points} 100,100`} fill="#0b76ff" opacity="0.1" />
        <polyline points={points} fill="none" stroke="#0b76ff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div style={{ position: 'absolute', top: 0, right: 0, fontWeight: 'bold', color: '#0b76ff', fontSize: '14px' }}>
        Actual: ${data[data.length-1].valor.toFixed(2)}
      </div>
    </div>
  );
};

const HorizontalBarChart = ({ data }: { data: {label: string, value: number}[] }) => {
  const maxVal = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map((item, i) => (
        <div key={i} style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, fontSize: 13 }}>
            <span style={{ fontWeight: 500 }}>{item.label}</span>
            <span style={{ color: '#666' }}>${item.value.toFixed(2)}</span>
          </div>
          <div style={{ width: '100%', background: '#eef6ff', borderRadius: 4, height: 8 }}>
            <div style={{
              width: `${(item.value / maxVal) * 100}%`,
              background: '#0b76ff',
              height: '100%',
              borderRadius: 4
            }} />
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Componente Card (TU ORIGINAL) ---
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
        {icon === 'store' && (
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M3 21h18v-8a2 2 0 00-2-2H5a2 2 0 00-2 2v8z" stroke="#0b76ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M3 7l9-4 9 4" stroke="#0b76ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M9 11v10" stroke="#0b76ff" strokeWidth="1.2"/>
             <path d="M15 11v10" stroke="#0b76ff" strokeWidth="1.2"/>
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

// --- ESTILOS ORIGINALES RESTAURADOS ---
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
  // GRID de tarjetas originales
  grid: {
    display: "grid",
    gap: 20,
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    marginBottom: 30,
  },
  // GRID de gráficas
  chartsGrid: {
    display: "grid",
    gap: 20,
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    marginBottom: 30,
  },
  // TU TARJETA ORIGINAL
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  subtitle: { marginTop: 4, color: '#6b7280' },
  headerActions: { display: 'flex', gap: 10, alignItems: 'center' },
  primaryAction: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#0b76ff', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' },
  cardTop: { display: 'flex', alignItems: 'center', gap: 12, minHeight: 52 },
  iconCircle: { width: 44, height: 44, borderRadius: 10, background: '#eef6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }, 
  cardLabel: { opacity: 0.7, marginBottom: 0, fontSize: 13, lineHeight: '1.2' },
  shortcutsSection: { marginTop: 18 },
  shortcutsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 },
  shortcutBtn: { padding: '10px 12px', background: '#1158f0', color: '#ffffff', border: '1px solid #e6eef6', borderRadius: 8, cursor: 'pointer' },
  // Estilo para títulos de gráficas
  chartTitle: { margin: '0 0 15px 0', fontSize: 16, color: '#333', borderBottom: '1px solid #eee', paddingBottom: 8 },
  noData: { textAlign: 'center', color: '#999', padding: 20 }
};

export default Dashboard;