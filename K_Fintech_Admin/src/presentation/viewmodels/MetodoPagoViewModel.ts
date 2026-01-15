import { useState, useEffect, useCallback, useMemo } from 'react';
import { GetMetodosPagoUseCase } from '../../domain/usecases/metodoPago/GetMetodosPagoUseCase';
import { CreateMetodoPagoUseCase } from '../../domain/usecases/metodoPago/CreateMetodoPagoUseCase';
import { UpdateMetodoPagoUseCase } from '../../domain/usecases/metodoPago/UpdateMetodoPagoUseCase';
import { DeleteMetodoPagoUseCase } from '../../domain/usecases/metodoPago/DeleteMetodoPagoUseCase';
import { MetodoPagoEntity } from '../../domain/entities/MetodoPago';
import { MetodoPagoRepositoryImpl } from '../../infrastructure/repositories/MetodoPagoRepositoryImpl';

export const useMetodoPagoViewModel = () => {
  const [metodos, setMetodos] = useState<MetodoPagoEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const metodoPagoRepository = useMemo(() => new MetodoPagoRepositoryImpl(), []);
  const getMetodosPagoUseCase = useMemo(() => new GetMetodosPagoUseCase(metodoPagoRepository), [metodoPagoRepository]);
  const createMetodoPagoUseCase = useMemo(() => new CreateMetodoPagoUseCase(metodoPagoRepository), [metodoPagoRepository]);
  const updateMetodoPagoUseCase = useMemo(() => new UpdateMetodoPagoUseCase(metodoPagoRepository), [metodoPagoRepository]);
  const deleteMetodoPagoUseCase = useMemo(() => new DeleteMetodoPagoUseCase(metodoPagoRepository), [metodoPagoRepository]);

  const cargarMetodos = useCallback(async () => {
    try {
      setLoading(true);
      const metodosResult = await getMetodosPagoUseCase.execute();
      setMetodos(metodosResult);
    } catch (err) {
      setError('Error al cargar métodos de pago');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getMetodosPagoUseCase]);

  const crearMetodo = useCallback(async (nombre: string, descripcion: string, activo: boolean) => {
    try {
      const nuevoMetodo = await createMetodoPagoUseCase.execute(nombre, descripcion, activo);
      setMetodos([...metodos, nuevoMetodo]);
      return nuevoMetodo;
    } catch (err) {
      setError('Error al crear método de pago');
      console.error(err);
      throw err;
    }
  }, [createMetodoPagoUseCase, metodos]);

  const actualizarMetodo = useCallback(async (id: number, updates: Partial<MetodoPagoEntity>) => {
    try {
      const metodoActualizado = await updateMetodoPagoUseCase.execute(id, updates);
      if (metodoActualizado) {
        setMetodos(metodos.map(m => m.id === id ? metodoActualizado : m));
        return metodoActualizado;
      }
    } catch (err) {
      setError('Error al actualizar método de pago');
      console.error(err);
      throw err;
    }
  }, [updateMetodoPagoUseCase, metodos]);

  const eliminarMetodo = useCallback(async (id: number) => {
    try {
      const success = await deleteMetodoPagoUseCase.execute(id);
      if (success) {
        setMetodos(metodos.filter(m => m.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError('Error al eliminar método de pago');
      console.error(err);
      throw err;
    }
  }, [deleteMetodoPagoUseCase, metodos]);

  useEffect(() => {
    cargarMetodos();
  }, [cargarMetodos]); // Include cargarMetodos in dependency array

  return {
    metodos,
    loading,
    error,
    cargarMetodos,
    crearMetodo,
    actualizarMetodo,
    eliminarMetodo
  };
};