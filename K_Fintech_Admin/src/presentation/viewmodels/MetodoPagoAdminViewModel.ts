import { useState, useEffect, useCallback, useMemo } from 'react';
import { GetMetodosPagoAdminUseCase } from '../../domain/usecases/metodoPagoAdmin/GetMetodosPagoAdminUseCase';
import { CreateMetodoPagoAdminUseCase } from '../../domain/usecases/metodoPagoAdmin/CreateMetodoPagoAdminUseCase';
import { UpdateMetodoPagoAdminUseCase } from '../../domain/usecases/metodoPagoAdmin/UpdateMetodoPagoAdminUseCase';
import { DeleteMetodoPagoAdminUseCase } from '../../domain/usecases/metodoPagoAdmin/DeleteMetodoPagoAdminUseCase';
import type { MetodoPagoAdmin } from '../../domain/entities/MetodoPagoAdmin';
import { MetodoPagoAdminRepositoryImpl } from '../../infrastructure/repositories/MetodoPagoAdminRepositoryImpl';

export const useMetodoPagoAdminViewModel = () => {
  const [metodosPago, setMetodosPago] = useState<MetodoPagoAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Creamos las instancias una sola vez usando useMemo
  const { 
    getMetodosPagoUseCase, 
    createMetodoPagoUseCase, 
    updateMetodoPagoUseCase, 
    deleteMetodoPagoUseCase 
  } = useMemo(() => {
    const repo = new MetodoPagoAdminRepositoryImpl();
    return {
      getMetodosPagoUseCase: new GetMetodosPagoAdminUseCase(repo),
      createMetodoPagoUseCase: new CreateMetodoPagoAdminUseCase(repo),
      updateMetodoPagoUseCase: new UpdateMetodoPagoAdminUseCase(repo),
      deleteMetodoPagoUseCase: new DeleteMetodoPagoAdminUseCase(repo)
    };
  }, []);

  const cargarMetodosPago = useCallback(async () => {
    try {
      setLoading(true);
      const metodosResult = await getMetodosPagoUseCase.execute();
      setMetodosPago(metodosResult);
    } catch (err) {
      setError('Error al cargar métodos de pago');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getMetodosPagoUseCase]);

  const crearMetodoPago = useCallback(async (metodoPagoData: Omit<MetodoPagoAdmin, "id">) => {
    try {
      const nuevoMetodoPago = await createMetodoPagoUseCase.execute(metodoPagoData);
      setMetodosPago(prev => [...prev, nuevoMetodoPago]);
      return nuevoMetodoPago;
    } catch (err) {
      setError('Error al crear método de pago');
      console.error(err);
      throw err;
    }
  }, [createMetodoPagoUseCase]);

  const actualizarMetodoPago = useCallback(async (id: number, metodoPagoData: Partial<Omit<MetodoPagoAdmin, 'id'>>) => {
    try {
      const metodoPagoActualizado = await updateMetodoPagoUseCase.execute(id, metodoPagoData);
      if (metodoPagoActualizado) {
        setMetodosPago(prev => prev.map(mp => mp.id === id ? metodoPagoActualizado : mp));
      }
      return metodoPagoActualizado;
    } catch (err) {
      setError('Error al actualizar método de pago');
      console.error(err);
      throw err;
    }
  }, [updateMetodoPagoUseCase]);

  const eliminarMetodoPago = useCallback(async (id: number) => {
    try {
      const success = await deleteMetodoPagoUseCase.execute(id);
      if (success) {
        setMetodosPago(prev => prev.map(mp => mp.id === id ? { ...mp, activo: false } : mp));
      }
      return success;
    } catch (err) {
      setError('Error al eliminar método de pago');
      console.error(err);
      throw err;
    }
  }, [deleteMetodoPagoUseCase]);

  useEffect(() => {
    cargarMetodosPago();
  }, [cargarMetodosPago]);

  return {
    metodosPago,
    loading,
    error,
    cargarMetodosPago,
    crearMetodoPago,
    actualizarMetodoPago,
    eliminarMetodoPago
  };
};