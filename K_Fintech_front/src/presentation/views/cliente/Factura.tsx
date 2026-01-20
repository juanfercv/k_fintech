import React, { useState, useEffect, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Factura } from '../../../domain/entities/Factura';

const FacturaCliente: React.FC = () => {
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({ fecha: '', estado: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const cargarFacturasCompletas = async () => {
            try {
                // 1. Pedimos la lista básica (que viene sin detalles)
                const res = await fetch('/api/facturas');
                const data = await res.json();
                const listaBasica = Array.isArray(data) ? data : (data.data || []);

                // 2. TRUCO: Como la lista básica no trae productos, 
                // vamos a llamar a la API "uno por uno" usando el ID (igual que hace VerFactura)
                const promesasDetalles = listaBasica.map(async (facturaSimple: any) => {
                    try {
                        // Llamamos a la ruta que SÍ funciona: /api/facturas/ID
                        const resDetalle = await fetch(`/api/facturas/${facturaSimple.idFactura}`);
                        const dataDetalle = await resDetalle.json();
                        
                        // Calculamos el total sumando los productos que vienen en 'detalle_facturas'
                        const detalles = dataDetalle.detalle_facturas || dataDetalle.detalles || [];
                        
                        const totalCalculado = detalles.reduce((sum: number, item: any) => {
                            return sum + (Number(item.precio_total) || 0);
                        }, 0);

                        // Devolvemos la factura completa con el total calculado inyectado
                        return {
                            ...dataDetalle, // Usamos la data completa
                            totalReal: totalCalculado > 0 ? totalCalculado : (Number(dataDetalle.total) || 0)
                        };
                    } catch (err) {
                        console.error(`Error cargando detalle factura ${facturaSimple.idFactura}`);
                        return facturaSimple;
                    }
                });

                // Esperamos a que se completen todas las peticiones
                const listaCompleta = await Promise.all(promesasDetalles);
                
                setFacturas(listaCompleta);
            } catch (error) {
                console.error("Error general:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarFacturasCompletas();
    }, []);

    // --- FILTROS ---
    const facturasFiltradas = facturas.filter(f =>
        (filtros.fecha ? f.fecha_emision === filtros.fecha : true) &&
        (filtros.estado ? f.estado_factura === filtros.estado : true)
    );

    // --- CÁLCULO DEL GRAN TOTAL ---
    // Ahora sumamos la propiedad 'totalReal' que calculamos arriba
    const granTotal = facturasFiltradas.reduce((suma, f: any) => {
        return suma + (f.totalReal || 0);
    }, 0);

    if (loading) return <p style={{textAlign: 'center', marginTop: 50}}>Cargando y calculando totales...</p>;

    return (
        <div style={container}>
            {/* HEADER */}
            <div style={header}>
                <div>
                    <h2 style={{ margin: 0 }}> Historial de Facturación</h2>
                </div>
                <button style={btnPrimary} onClick={() => navigate('/nueva-factura')}>
                    + Emitir Factura
                </button>
            </div>

            {/* TARJETA DEL TOTAL (Aquí saldrá la suma correcta) */}
            <div style={summaryCard}>
                <span style={{ fontSize: '15px', color: '#555', fontWeight: 600 }}>
                    Total Facturado:
                </span>
                <span style={{ fontSize: '26px', fontWeight: 'bold', color: '#28a745', marginLeft: '10px' }}>
                    $ {granTotal.toFixed(2)}
                </span>
            </div>

            {/* FILTROS */}
            <div style={filters}>
                <input
                    type="date"
                    style={input}
                    onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })}
                />
                <select
                    style={input}
                    onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                >
                    <option value="">Todos los estados</option>
                    <option value="Emitida">Emitida</option>
                    <option value="Anulada">Anulada</option>
                </select>
            </div>

            {/* TABLA */}
            <div style={tableWrapper}>
                <table style={table}>
                    <thead>
                        <tr>
                            <th style={th}>ID</th>
                            <th style={th}>Fecha</th>
                            <th style={th}>Total</th>
                            <th style={th}>Estado</th>
                            <th style={th}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facturasFiltradas.length > 0 ? (
                            facturasFiltradas.map((f: any) => (
                                <tr key={f.idFactura}>
                                    <td style={td}>#{f.idFactura}</td>
                                    <td style={td}>{f.fecha_emision}</td>
                                    
                                    {/* Mostramos el totalReal que calculamos */}
                                    <td style={{ ...td, fontWeight: 'bold', color: '#333' }}>
                                        $ {(f.totalReal || 0).toFixed(2)}
                                    </td>
                                    
                                    <td style={td}>
                                        <span style={badge(f.estado_factura)}>
                                            {f.estado_factura}
                                        </span>
                                    </td>
                                    <td style={td}>
                                        <button
                                            style={btnSmall}
                                            onClick={() => navigate(`/facturas/${f.idFactura}`)}
                                        >
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={empty}>
                                    No hay facturas registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* ===================== ESTILOS ===================== */

const container: CSSProperties = { maxWidth: '1000px', margin: '40px auto', padding: '20px', fontFamily: 'Segoe UI, Arial, sans-serif' };
const header: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const summaryCard: CSSProperties = { background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '10px', marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };
const filters: CSSProperties = { display: 'flex', gap: '15px', marginBottom: '20px' };
const input: CSSProperties = { padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' };
const tableWrapper: CSSProperties = { background: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid #e5e7eb' };
const table: CSSProperties = { width: '100%', borderCollapse: 'collapse' };
const th: CSSProperties = { background: '#f9fafb', padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' };
const td: CSSProperties = { padding: '16px', borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#4b5563' };
const empty: CSSProperties = { textAlign: 'center', padding: '40px', color: '#9ca3af' };
const btnPrimary: CSSProperties = { background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'background 0.2s' };
const btnSmall: CSSProperties = { background: '#fff', color: '#2563eb', border: '1px solid #2563eb', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 };
const badge = (estado: string): CSSProperties => ({ padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500, color: '#fff', background: estado === 'Emitida' ? '#10b981' : estado === 'Anulada' ? '#ef4444' : '#6b7280', textTransform: 'capitalize' });

export default FacturaCliente;