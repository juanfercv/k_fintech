import { useState, useEffect, useCallback, useMemo } from 'react';
import { GetMetodosPagoUseCase } from '../../domain/usecases/metodoPago/GetMetodosPagoUseCase';
import { SeleccionarMetodoPagoUseCase } from '../../domain/usecases/metodoPago/SeleccionarMetodoPagoUseCase';
import { MetodoPagoEntity } from '../../domain/entities/MetodoPago';
import { MetodoPagoRepositoryImpl } from '../../infrastructure/repositories/MetodoPagoRepositoryImpl';

export const useMetodoPagoViewModel = () => {
  const [metodos, setMetodos] = useState<MetodoPagoEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const metodoPagoRepository = useMemo(() => new MetodoPagoRepositoryImpl(), []);
  const getMetodosPagoUseCase = useMemo(() => new GetMetodosPagoUseCase(metodoPagoRepository), [metodoPagoRepository]);
  const seleccionarMetodoPagoUseCase = useMemo(() => new SeleccionarMetodoPagoUseCase(metodoPagoRepository), [metodoPagoRepository]);

  const cargarMetodos = useCallback(async () => {
    try {
      setLoading(true);
      const metodosResult = await getMetodosPagoUseCase.execute();
      setMetodos(metodosResult);
    } catch (err) {
      console.error('Error al cargar métodos de pago:', err);
      setError('Error al cargar métodos de pago');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getMetodosPagoUseCase, setLoading, setMetodos]);

  const seleccionarMetodoPago = async (metodoIds: number[]) => {
    try {
      const metodosSeleccionados = await seleccionarMetodoPagoUseCase.execute(metodoIds);
      return metodosSeleccionados;
    } catch (err) {
      console.error('Error al seleccionar métodos de pago:', err);
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    cargarMetodos();
  }, [cargarMetodos]);

  return {
    metodos,
    loading,
    error,
    cargarMetodos,
    seleccionarMetodoPago
  };
};