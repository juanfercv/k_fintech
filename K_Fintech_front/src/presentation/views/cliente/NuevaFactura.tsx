import React, { useState, useEffect, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Cliente } from '../../../domain/entities/Cliente';
import { type DetalleFactura } from '../../../domain/entities/Factura';

const NuevaFactura: React.FC = () => {
    const navigate = useNavigate();

    // ================== ESTADOS ==================
    const [tiendas, setTiendas] = useState<any[]>([]);
    const [idTiendaSel, setIdTiendaSel] = useState<number | string>('');
    const [cedulaBusqueda, setCedulaBusqueda] = useState('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
    const [mostrarRegistroRapido, setMostrarRegistroRapido] = useState(false);
    const [mensajeCliente, setMensajeCliente] = useState('');

    const [nuevoCliente, setNuevoCliente] = useState({
        nombre_cliente: '',
        direccion_cliente: '',
        correo_cliente: '',
        celular_cliente: ''
    });

    const [detalles, setDetalles] = useState<DetalleFactura[]>([]);
    const [descuento, setDescuento] = useState(0);

    const [totales, setTotales] = useState({
        subtotal: 0,
        base0: 0,
        base15: 0,
        iva: 0,
        total: 0
    });

    // ================== DATOS ==================
    useEffect(() => {
        fetch('/api/tiendas')
            .then(res => res.json())
            .then(data => setTiendas(data))
            .catch(err => console.error(err));
    }, []);

    const tiendaSeleccionada = tiendas.find(t => t.idTienda == idTiendaSel);

    const buscarCliente = async (cedula: string) => {
        setCedulaBusqueda(cedula);

        if (cedula.length < 10) {
            setMensajeCliente('Mínimo 10 dígitos');
            setClienteSeleccionado(null);
            return;
        }

        setMensajeCliente('Buscando...');
        const res = await fetch('/api/clientes');
        const lista: Cliente[] = await res.json();
        const encontrado = lista.find(c => c.cedula_cliente === cedula);

        if (encontrado) {
            setClienteSeleccionado(encontrado);
            setMostrarRegistroRapido(false);
            setMensajeCliente('✅ Cliente encontrado');
        } else {
            setClienteSeleccionado(null);
            setMostrarRegistroRapido(true);
            setMensajeCliente('❌ Cliente no existe, registre los datos');
        }
    };

    // ================== CÁLCULOS ==================
    useEffect(() => {
        let subtotal = 0;
        let base0 = 0;
        let base15 = 0;

        detalles.forEach(d => {
            const total = d.cantidad * d.precio_unitario;
            subtotal += total;
            d.precio_unitario === 0 ? base0 += total : base15 += total;
        });

        const iva = base15 * 0.15;

        setTotales({
            subtotal,
            base0,
            base15,
            iva,
            total: subtotal + iva - descuento
        });
    }, [detalles, descuento]);

    // ================== DETALLES ==================
    const agregarFila = () => {
        setDetalles([...detalles, {
            descripcion: '',
            cantidad: 1,
            precio_unitario: 0,
            precio_total: 0
        }]);
    };

    const eliminarFila = (i: number) => {
        setDetalles(detalles.filter((_, index) => index !== i));
    };

    const actualizarItem = (i: number, campo: keyof DetalleFactura, valor: any) => {
        const copia = [...detalles];
        // @ts-ignore
        copia[i][campo] = valor;
        copia[i].precio_total = copia[i].cantidad * copia[i].precio_unitario;
        setDetalles(copia);
    };

    // ================== GUARDAR ==================
    const emitirFactura = async () => {
        if (!idTiendaSel) return alert('Seleccione tienda');
        if (!clienteSeleccionado && !mostrarRegistroRapido) return alert('Identifique cliente');
        if (detalles.length === 0) return alert('Agregue productos');

        try {
            let idCliente = clienteSeleccionado?.id_cliente;

            if (mostrarRegistroRapido) {
                const r = await fetch('/api/clientes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...nuevoCliente, cedula_cliente: cedulaBusqueda })
                });
                const cli = await r.json();
                idCliente = cli.id_cliente;
            }

            const res = await fetch('/api/facturas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idTienda: idTiendaSel,
                    idCliente,
                    fecha_emision: new Date().toISOString().split('T')[0],
                    estado_factura: 'Emitida'
                })
            });

            const factura = await res.json();

            for (const d of detalles) {
                await fetch(`/api/add/${factura.idFactura}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(d)
                });
            }

            alert('Factura emitida correctamente');
            navigate('/facturas');

        } catch (e: any) {
            alert('Error: ' + e.message);
        }
    };

    // ================== UI ==================
    return (
        <div style={container}>
            <h2>Nueva Factura</h2>

            {/* TIENDA / CLIENTE */}
            <div style={grid2}>
                <div style={card}>
                    <h3>🏪 Tienda</h3>
                    <select style={input} value={idTiendaSel} onChange={e => setIdTiendaSel(e.target.value)}>
                        <option value="">Seleccione tienda</option>
                        {tiendas.map(t => (
                            <option key={t.idTienda} value={t.idTienda}>{t.nombreTienda}</option>
                        ))}
                    </select>

                    {tiendaSeleccionada && (
                        <div style={info}>
                            <p><b>RUC:</b> {tiendaSeleccionada.RUCTienda}</p>
                            <p><b>Dirección:</b> {tiendaSeleccionada.direccion_sucursal_tienda}</p>
                            <p><b>Correo:</b> {tiendaSeleccionada.correo_electronico_tienda}</p>
                            <p><b>Tel:</b> {tiendaSeleccionada.telefono}</p>
                        </div>
                    )}
                </div>

                <div style={card}>
                    <h3>👤 Cliente</h3>
                    <input style={input} placeholder="Cédula / RUC"
                        value={cedulaBusqueda}
                        onChange={e => buscarCliente(e.target.value)} />
                    <p style={{ fontSize: 13 }}>{mensajeCliente}</p>

                    {clienteSeleccionado && (
                        <div style={info}>
                            <p><b>Nombre:</b> {clienteSeleccionado.nombre_cliente}</p>
                            <p><b>Correo:</b> {clienteSeleccionado.correo_cliente}</p>
                            <p><b>Dirección:</b> {clienteSeleccionado.direccion_cliente}</p>
                            <p><b>Tel:</b> {clienteSeleccionado.celular_cliente}</p>
                        </div>
                    )}

                    {mostrarRegistroRapido && (
                        <div style={{ display: 'grid', gap: 8 }}>
                            <input style={input} placeholder="Nombre"
                                onChange={e => setNuevoCliente({ ...nuevoCliente, nombre_cliente: e.target.value })} />
                            <input style={input} placeholder="Dirección"
                                onChange={e => setNuevoCliente({ ...nuevoCliente, direccion_cliente: e.target.value })} />
                            <input style={input} placeholder="Correo"
                                onChange={e => setNuevoCliente({ ...nuevoCliente, correo_cliente: e.target.value })} />
                            <input style={input} placeholder="Teléfono"
                                onChange={e => setNuevoCliente({ ...nuevoCliente, celular_cliente: e.target.value })} />
                        </div>
                    )}
                </div>
            </div>

            {/* DETALLE */}
            <table style={table}>
                <thead>
                    <tr>
                        <th style={th}>Cant</th>
                        <th style={th}>Descripción</th>
                        <th style={th}>P.Unit</th>
                        <th style={{ ...th, textAlign: 'right' }}>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {detalles.map((d, i) => (
                        <tr key={i}>
                            <td><input type="number" style={cell} value={d.cantidad}
                                onChange={e => actualizarItem(i, 'cantidad', Number(e.target.value))} /></td>
                            <td><input style={cell} onChange={e => actualizarItem(i, 'descripcion', e.target.value)} /></td>
                            <td><input type="number" style={cell} value={d.precio_unitario}
                                onChange={e => actualizarItem(i, 'precio_unitario', Number(e.target.value))} /></td>
                            <td style={{ textAlign: 'right', padding: 10 }}>
                                ${d.precio_total.toFixed(2)}
                            </td>
                            <td>
                                <button onClick={() => eliminarFila(i)} style={delBtn}>✖</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={agregarFila} style={btnAdd}>+ Añadir item</button>

            {/* TOTALES */}
            <div style={totalesBox}>
                <p>Subtotal <b>${totales.subtotal.toFixed(2)}</b></p>
                <p>Base 0% <b>${totales.base0.toFixed(2)}</b></p>
                <p>Base 15% <b>${totales.base15.toFixed(2)}</b></p>
                <p>IVA 15% <b>${totales.iva.toFixed(2)}</b></p>
                <p>
                    Descuento
                    <input type="number" value={descuento}
                        onChange={e => setDescuento(Number(e.target.value))}
                        style={{ width: 80, textAlign: 'right' }} />
                </p>
                <hr />
                <h3>TOTAL ${totales.total.toFixed(2)}</h3>
                <button onClick={emitirFactura} style={btnEmitir}>EMITIR FACTURA</button>
            </div>
        </div>
    );
};

// ================== ESTILOS ==================
const container: CSSProperties = { maxWidth: 1100, margin: '40px auto', padding: 30 };
const grid2: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 };
const card: CSSProperties = { padding: 20, border: '1px solid #ddd', borderRadius: 8 };
const input: CSSProperties = { width: '100%', padding: 10, marginBottom: 10 };
const info: CSSProperties = { fontSize: 14 };
const table: CSSProperties = { width: '100%', marginTop: 30, borderCollapse: 'collapse' };
const th: CSSProperties = { padding: 12, background: '#f4f4f4', textAlign: 'left' };
const cell: CSSProperties = { width: '100%', padding: 8 };
const delBtn: CSSProperties = { border: 'none', background: 'none', color: 'red', cursor: 'pointer' };
const btnAdd: CSSProperties = { marginTop: 10, padding: '10px 15px', background: '#3498db' };
const totalesBox: CSSProperties = { marginTop: 30, maxWidth: 350, marginLeft: 'auto' };
const btnEmitir: CSSProperties = {
    width: '100%',
    padding: 14,
    background: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer'
};

export default NuevaFactura;
