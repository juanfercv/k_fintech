import { useState, useEffect, useCallback, useMemo } from 'react';
import { TiendaRepositoryImpl } from '../../infrastructure/repositories/TiendaRepositoryImpl';
import { 
  GetTiendasUseCase,
  GetTiendaByIdUseCase,
  CreateTiendaUseCase,
  UpdateTiendaUseCase,
  DeleteTiendaUseCase,
  GetTiendasByFiltrosUseCase
} from '../../domain/usecases/tienda';

export const useTiendaViewModel = () => {
  const [tiendas, setTiendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState({ estado: '', ciudad: '', nombre: '' });

  const repository = useMemo(() => new TiendaRepositoryImpl(), []);
  const getTiendasUseCase = useMemo(() => new GetTiendasUseCase(repository), [repository]);
  const getTiendaByIdUseCase = useMemo(() => new GetTiendaByIdUseCase(repository), [repository]);
  const createTiendaUseCase = useMemo(() => new CreateTiendaUseCase(repository), [repository]);
  const updateTiendaUseCase = useMemo(() => new UpdateTiendaUseCase(repository), [repository]);
  const deleteTiendaUseCase = useMemo(() => new DeleteTiendaUseCase(repository), [repository]);
  const getTiendasByFiltrosUseCase = useMemo(() => new GetTiendasByFiltrosUseCase(repository), [repository]);

  const cargarTiendas = useCallback(async (filtrosAplicar = filtros) => {
    try {
      setLoading(true);
      setError(null);
      
      let tiendasResult;
      if (filtrosAplicar.estado || filtrosAplicar.ciudad || filtrosAplicar.nombre) {
        tiendasResult = await getTiendasByFiltrosUseCase.execute(filtrosAplicar);
      } else {
        tiendasResult = await getTiendasUseCase.execute();
      }
      
      setTiendas(tiendasResult);
    } catch (err) {
      setError('Error al cargar tiendas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getTiendasUseCase, getTiendasByFiltrosUseCase, filtros]);

  const crearTienda = useCallback(async (tiendaData: any) => {
    try {
      const nuevaTienda = await createTiendaUseCase.execute(tiendaData);
      setTiendas(prev => [...prev, nuevaTienda]);
      return nuevaTienda;
    } catch (err) {
      setError('Error al crear tienda');
      console.error(err);
      throw err;
    }
  }, [createTiendaUseCase]);

  const actualizarTienda = useCallback(async (id: number, tiendaData: any) => {
    try {
      const tiendaActualizada = await updateTiendaUseCase.execute(id, tiendaData);
      if (tiendaActualizada) {
        setTiendas(prev => prev.map(t => t.idTienda === id ? tiendaActualizada : t));
        return tiendaActualizada;
      }
    } catch (err) {
      setError('Error al actualizar tienda');
      console.error(err);
      throw err;
    }
  }, [updateTiendaUseCase]);

  const eliminarTienda = useCallback(async (id: number) => {
    try {
      const success = await deleteTiendaUseCase.execute(id);
      if (success) {
        setTiendas(prev => prev.filter(t => t.idTienda !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError('Error al eliminar tienda');
      console.error(err);
      throw err;
    }
  }, [deleteTiendaUseCase]);

  const aplicarFiltros = useCallback((nuevosFiltros: any) => {
    setFiltros(nuevosFiltros);
    cargarTiendas(nuevosFiltros);
  }, [cargarTiendas]);

  useEffect(() => {
    cargarTiendas();
  }, [cargarTiendas]);

  return {
    tiendas,
    loading,
    error,
    filtros,
    cargarTiendas,
    crearTienda,
    actualizarTienda,
    eliminarTienda,
    aplicarFiltros
  };
};