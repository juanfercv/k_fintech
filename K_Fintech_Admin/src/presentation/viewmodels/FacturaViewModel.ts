import { useState, useEffect, useCallback, useMemo } from 'react';
import { FacturaRepositoryImpl } from '../../infrastructure/repositories/FacturaRepositoryImpl';
import { 
  GetFacturasUseCase, 
  GetFacturaByIdUseCase, 
  CreateFacturaUseCase, 
  UpdateFacturaUseCase, 
  DeleteFacturaUseCase 
} from '../usecases/factura';

export const useFacturaViewModel = () => {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new FacturaRepositoryImpl(), []);
  const getFacturasUseCase = useMemo(() => new GetFacturasUseCase(repository), [repository]);
  const getFacturaByIdUseCase = useMemo(() => new GetFacturaByIdUseCase(repository), [repository]);
  const createFacturaUseCase = useMemo(() => new CreateFacturaUseCase(repository), [repository]);
  const updateFacturaUseCase = useMemo(() => new UpdateFacturaUseCase(repository), [repository]);
  const deleteFacturaUseCase = useMemo(() => new DeleteFacturaUseCase(repository), [repository]);

  const cargarFacturas = useCallback(async () => {
    try {
      setLoading(true);
      const facturasResult = await getFacturasUseCase.execute();
      setFacturas(facturasResult);
    } catch (err) {
      setError('Error al cargar facturas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getFacturasUseCase]);

  const crearFactura = useCallback(async (facturaData: any) => {
    try {
      const nuevaFactura = await createFacturaUseCase.execute(facturaData);
      setFacturas(prev => [...prev, nuevaFactura]);
      return nuevaFactura;
    } catch (err) {
      setError('Error al crear factura');
      console.error(err);
      throw err;
    }
  }, [createFacturaUseCase]);

  const actualizarFactura = useCallback(async (id: number, facturaData: any) => {
    try {
      const facturaActualizada = await updateFacturaUseCase.execute(id, facturaData);
      if (facturaActualizada) {
        setFacturas(prev => prev.map(f => f.idFactura === id ? facturaActualizada : f));
        return facturaActualizada;
      }
    } catch (err) {
      setError('Error al actualizar factura');
      console.error(err);
      throw err;
    }
  }, [updateFacturaUseCase]);

  const eliminarFactura = useCallback(async (id: number) => {
    try {
      const success = await deleteFacturaUseCase.execute(id);
      if (success) {
        setFacturas(prev => prev.filter(f => f.idFactura !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError('Error al eliminar factura');
      console.error(err);
      throw err;
    }
  }, [deleteFacturaUseCase]);

  useEffect(() => {
    cargarFacturas();
  }, [cargarFacturas]);

  return {
    facturas,
    loading,
    error,
    cargarFacturas,
    crearFactura,
    actualizarFactura,
    eliminarFactura
  };
};