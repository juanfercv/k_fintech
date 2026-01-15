import { useState, useEffect, useCallback, useMemo } from 'react';
import { GetFacturasUseCase } from '../../domain/usecases/factura/GetFacturasUseCase';
import { GetFacturaByIdUseCase } from '../../domain/usecases/factura/GetFacturaByIdUseCase';
import { CreateFacturaUseCase } from '../../domain/usecases/factura/CreateFacturaUseCase';
import { UpdateFacturaUseCase } from '../../domain/usecases/factura/UpdateFacturaUseCase';
import { DeleteFacturaUseCase } from '../../domain/usecases/factura/DeleteFacturaUseCase';
import type { Factura } from '../../domain/entities/Factura';
import { FacturaRepositoryImpl } from '../../infrastructure/repositories/FacturaRepositoryImpl';

export const useFacturaViewModel = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Creamos las instancias una sola vez usando useMemo
  const { 
    getFacturasUseCase,
    getFacturaByIdUseCase,
    createFacturaUseCase, 
    updateFacturaUseCase, 
    deleteFacturaUseCase 
  } = useMemo(() => {
    const repo = new FacturaRepositoryImpl();
    return {
      getFacturasUseCase: new GetFacturasUseCase(repo),
      getFacturaByIdUseCase: new GetFacturaByIdUseCase(repo),
      createFacturaUseCase: new CreateFacturaUseCase(repo),
      updateFacturaUseCase: new UpdateFacturaUseCase(repo),
      deleteFacturaUseCase: new DeleteFacturaUseCase(repo)
    };
  }, []);

  const cargarFacturas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getFacturasUseCase.execute();
      setFacturas(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las facturas');
      console.error('Error loading facturas:', err);
    } finally {
      setLoading(false);
    }
  }, [getFacturasUseCase]);

  const obtenerFactura = useCallback(async (id: number) => {
    try {
      return await getFacturaByIdUseCase.execute(id);
    } catch (err) {
      console.error('Error getting factura:', err);
      throw err;
    }
  }, [getFacturaByIdUseCase]);

  const crearFactura = useCallback(async (facturaData: Omit<Factura, 'id'>) => {
    try {
      const nuevaFactura = await createFacturaUseCase.execute(facturaData);
      setFacturas(prev => [...prev, nuevaFactura]);
      return nuevaFactura;
    } catch (err) {
      console.error('Error creating factura:', err);
      throw err;
    }
  }, [createFacturaUseCase]);

  const actualizarFactura = useCallback(async (id: number, facturaData: Partial<Omit<Factura, 'id'>>) => {
    try {
      const facturaActualizada = await updateFacturaUseCase.execute(id, facturaData);
      if (facturaActualizada) {
        setFacturas(prev => prev.map(f => f.id === id ? facturaActualizada : f));
      }
      return facturaActualizada;
    } catch (err) {
      console.error('Error updating factura:', err);
      throw err;
    }
  }, [updateFacturaUseCase]);

  const eliminarFactura = useCallback(async (id: number) => {
    try {
      const success = await deleteFacturaUseCase.execute(id);
      if (success) {
        setFacturas(prev => prev.filter(f => f.id !== id));
      }
      return success;
    } catch (err) {
      console.error('Error deleting factura:', err);
      throw err;
    }
  }, [deleteFacturaUseCase]);

  // Cargar facturas al inicializar
  useEffect(() => {
    cargarFacturas();
  }, [cargarFacturas]);

  return {
    facturas,
    loading,
    error,
    cargarFacturas,
    obtenerFactura,
    crearFactura,
    actualizarFactura,
    eliminarFactura,
  };
};