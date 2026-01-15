import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerFactura: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [factura, setFactura] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/facturas/${id}`)
            .then(res => res.json())
            .then(data => {
                setFactura(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <p style={{ textAlign: 'center' }}>Cargando factura...</p>;
    if (!factura) return <p>No se pudo cargar la factura</p>;

    return (
        <div style={{
            maxWidth: '900px',
            margin: '40px auto',
            padding: '30px',
            background: '#fff',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            fontFamily: 'Arial, sans-serif'
        }}>

            {/* BOTÓN */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: '20px',
                    background: 'none',
                    border: 'none',
                    color: '#007bff',
                    cursor: 'pointer'
                }}
            >
                ← Volver
            </button>

            {/* ENCABEZADO */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{ margin: 0 }}>{factura.tienda?.nombreTienda}</h2>
                    <p style={{ margin: '4px 0' }}>{factura.tienda?.direccion_sucursal_tienda}</p>
                    <p style={{ margin: '4px 0' }}>RUC: {factura.tienda?.RUCTienda}</p>
                    <p style={{ margin: '4px 0' }}>Tel: {factura.tienda?.telefono}</p>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ margin: 0 }}>FACTURA</h2>
                    <p><b>N°:</b> {factura.idFactura}</p>
                    <p><b>Fecha:</b> {factura.fecha_emision}</p>
                    <p><b>Estado:</b> {factura.estado_factura}</p>
                </div>
            </div>

            <hr />

            {/* CLIENTE */}
            <h3>Datos del Cliente</h3>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
            }}>
                <p><b>Nombre:</b> {factura.cliente?.nombre_cliente}</p>
                <p><b>Cédula:</b> {factura.cliente?.cedula_cliente}</p>
                <p><b>Correo:</b> {factura.cliente?.correo_cliente}</p>
                <p><b>Dirección:</b> {factura.cliente?.direccion_cliente}</p>
            </div>

            <hr />

            {/* DETALLE */}
            <h3>Detalle de la Factura</h3>

            <table width="100%" style={{ borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f2f2f2' }}>
                    <tr>
                        <th style={th}>Descripción</th>
                        <th style={th}>Cantidad</th>
                        <th style={th}>Precio Unit.</th>
                        <th style={th}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {factura.detalle_facturas?.map((d: any, index: number) => (
                        <tr key={index}>
                            <td style={td}>{d.descripcion}</td>
                            <td style={td}>{d.cantidad}</td>
                            <td style={td}>${d.precio_unitario}</td>
                            <td style={td}>${d.precio_total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* TOTALES */}
            <div style={{
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <div style={{ width: '300px' }}>
                    <p style={totalRow}><span>Subtotal:</span> <span>${factura.subtotal}</span></p>
                    <p style={totalRow}><span>IVA (15%):</span> <span>${factura.iva}</span></p>
                    <hr />
                    <h3 style={{ textAlign: 'right' }}>TOTAL: ${factura.total}</h3>
                </div>
            </div>

        </div>
    );
};

const th = {
    padding: '10px',
    borderBottom: '1px solid #ccc',
    textAlign: 'left'
};

const td = {
    padding: '10px',
    borderBottom: '1px solid #eee'
};

const totalRow = {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '5px 0'
};

export default VerFactura;
