import { useState, useEffect, useCallback, useMemo } from 'react';
import { GetTiendaUseCase } from '../../domain/usecases/tienda/GetTiendaUseCase';
import { TiendaEntity } from '../../domain/entities/Tienda';
import { TiendaRepositoryImpl } from '../../infrastructure/repositories/TiendaRepositoryImpl';

export const useTiendaViewModel = (userId: number) => {
  const [tiendas, setTiendas] = useState<TiendaEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tiendaRepository = useMemo(() => new TiendaRepositoryImpl(), []);
  const getTiendaUseCase = useMemo(() => new GetTiendaUseCase(tiendaRepository), [tiendaRepository]);

  const cargarTiendas = useCallback(async () => {
    try {
      setLoading(true);
      const tiendasResult = await getTiendaUseCase.execute(userId);
      setTiendas(tiendasResult);
    } catch (err) {
      console.error('Error al cargar tiendas:', err);
      setError('Error al cargar tiendas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getTiendaUseCase, userId, setLoading, setTiendas]);

  useEffect(() => {
    cargarTiendas();
  }, [userId, cargarTiendas]);

  return {
    tiendas,
    loading,
    error,
    cargarTiendas
  };
};