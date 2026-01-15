import React, { useState, useEffect, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Factura } from '../../../domain/entities/Factura';

const FacturaCliente: React.FC = () => {
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [filtros, setFiltros] = useState({ fecha: '', estado: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const cargarFacturas = async () => {
            try {
                const res = await fetch('/api/facturas');
                const data = await res.json();
                setFacturas(data);
            } catch (error) {
                console.error("Error al cargar facturas:", error);
            }
        };
        cargarFacturas();
    }, []);

    const facturasFiltradas = facturas.filter(f =>
        (filtros.fecha ? f.fecha_emision === filtros.fecha : true) &&
        (filtros.estado ? f.estado_factura === filtros.estado : true)
    );

    return (
        <div style={container}>
            {/* HEADER */}
            <div style={header}>
                <h2 style={{ margin: 0 }}>📄 Historial de Facturación</h2>
                <button style={btnPrimary} onClick={() => navigate('/nueva-factura')}>
                    + Emitir Factura
                </button>
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
                            <th style={th}>Factura</th>
                            <th style={th}>Fecha</th>
                            <th style={th}>Estado</th>
                            <th style={th}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facturasFiltradas.length > 0 ? (
                            facturasFiltradas.map(f => (
                                <tr key={f.idFactura}>
                                    <td style={td}>#{f.idFactura}</td>
                                    <td style={td}>{f.fecha_emision}</td>
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
                                <td colSpan={4} style={empty}>
                                    No hay facturas disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* ===================== */
/* 🎨 ESTILOS TIPADOS */
/* ===================== */

const container: CSSProperties = {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
};

const header: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px'
};

const filters: CSSProperties = {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px'
};

const input: CSSProperties = {
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #ccc'
};

const tableWrapper: CSSProperties = {
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 8px rgba(0,0,0,0.08)',
    overflow: 'hidden'
};

const table: CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse'
};

const th: CSSProperties = {
    background: '#f5f5f5',
    padding: '12px',
    textAlign: 'left',
    fontSize: '14px'
};

const td: CSSProperties = {
    padding: '12px',
    borderBottom: '1px solid #eee',
    fontSize: '14px'
};

const empty: CSSProperties = {
    textAlign: 'center',
    padding: '20px',
    color: '#777'
};

const btnPrimary: CSSProperties = {
    background: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    cursor: 'pointer'
};

const btnSmall: CSSProperties = {
    background: '#17a2b8',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '5px',
    cursor: 'pointer'
};

const badge = (estado: string): CSSProperties => ({
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    color: '#fff',
    background:
        estado === 'Emitida' ? '#28a745' :
        estado === 'Anulada' ? '#dc3545' :
        '#6c757d'
});

export default FacturaCliente;
