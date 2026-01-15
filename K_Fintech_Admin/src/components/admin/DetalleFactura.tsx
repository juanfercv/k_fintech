import React, { useState, useEffect } from 'react';
import { useFacturaViewModel } from '../../presentation/viewmodels/FacturaViewModel';
import type { Factura } from '../../domain/entities/Factura';

interface DetalleFacturaProps {
  facturaId: number;
  onClose: () => void;
}

const DetalleFactura: React.FC<DetalleFacturaProps> = ({ facturaId, onClose }) => {
  const { facturas, cargarFacturas } = useFacturaViewModel();
  const [factura, setFactura] = useState<Factura | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFactura = async () => {
      try {
        await cargarFacturas();
        const facturaFound = facturas.find(f => f.id === facturaId);
        setFactura(facturaFound || null);
      } catch (error) {
        console.error('Error al cargar la factura:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFactura();
  }, [facturaId, cargarFacturas, facturas]);

  if (loading) {
    return <div className="loading">Cargando detalle de factura...</div>;
  }

  if (!factura) {
    return <div className="error">Factura no encontrada</div>;
  }

  return (
    <div className="detalle-factura-container">
      <div className="detalle-factura-header">
        <h2>Detalle de Factura #{factura.id}</h2>
        <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
      </div>
      
      <div className="detalle-factura-content">
        <div className="detalle-factura-info">
          <div className="info-row">
            <div className="info-item">
              <strong>ID:</strong> {factura.id}
            </div>
            <div className="info-item">
              <strong>Fecha de Emisión:</strong> {factura.fecha_emision}
            </div>
          </div>
          
          <div className="info-row">
            <div className="info-item">
              <strong>Tienda ID:</strong> {factura.tiendaId}
            </div>
            <div className="info-item">
              <strong>Cliente ID:</strong> {factura.clienteId}
            </div>
          </div>
          
          <div className="info-row">
            <div className="info-item">
              <strong>Método de Pago ID:</strong> {factura.metodoPagoId}
            </div>
            <div className="info-item">
              <strong>Total:</strong> ${factura.total.toFixed(2)}
            </div>
          </div>
          
          <div className="info-row">
            <div className="info-item">
              <strong>Estado:</strong> 
              <span className={`estado-label ${factura.estado.toLowerCase()}`}>
                {factura.estado}
              </span>
            </div>
            <div className="info-item">
              <strong>Número de Factura:</strong> {factura.numero_factura || 'N/A'}
            </div>
          </div>
          
          <div className="info-row">
            <div className="info-item">
              <strong>Subtotal:</strong> ${factura.subtotal?.toFixed(2) || '0.00'}
            </div>
            <div className="info-item">
              <strong>Impuestos:</strong> ${factura.impuestos?.toFixed(2) || '0.00'}
            </div>
          </div>
          
          <div className="info-row">
            <div className="info-item">
              <strong>Forma de Pago:</strong> {factura.forma_pago || 'N/A'}
            </div>
            <div className="info-item">
              <strong>Fecha de Vencimiento:</strong> {factura.fecha_vencimiento || 'N/A'}
            </div>
          </div>
        </div>
        
        <div className="detalle-factura-detalle">
          <h3>Detalle Adicional</h3>
          <p>{factura.detalle || 'No hay detalles adicionales.'}</p>
        </div>
        
        <div className="detalle-factura-documentos">
          <h3>Documentos</h3>
          <div className="documentos-actions">
            {factura.xml_url && (
              <a 
                href={factura.xml_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Descargar XML
              </a>
            )}
            {factura.pdf_url && (
              <a 
                href={factura.pdf_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Ver PDF
              </a>
            )}
            {!factura.xml_url && !factura.pdf_url && (
              <p>No hay documentos disponibles para esta factura.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleFactura;