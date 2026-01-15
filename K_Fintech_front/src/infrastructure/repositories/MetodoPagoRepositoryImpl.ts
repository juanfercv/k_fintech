import type { MetodoPagoRepository } from '../../domain/repositories/MetodoPagoRepository';
import { MetodoPagoEntity } from '../../domain/entities/MetodoPago';
import { metodoPagoService } from '../../services/api';



export class MetodoPagoRepositoryImpl implements MetodoPagoRepository {
  async getAll(): Promise<MetodoPagoEntity[]> {
    try {
      const data = await metodoPagoService.getAll();
      return data.map(MetodoPagoEntity.fromBackend);
    } catch (error) {
      console.error('Error fetching all payment methods:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<MetodoPagoEntity | null> {
    try {
      const data = await metodoPagoService.getById(id.toString());
      return MetodoPagoEntity.fromBackend(data);
    } catch (error) {
      console.error('Error fetching payment method by id:', error);
      return null;
    }
  }

  async create(metodo: MetodoPagoEntity): Promise<MetodoPagoEntity> {
    try {
      const data = await metodoPagoService.create(metodo);
      return MetodoPagoEntity.fromBackend(data);
    } catch (error) {
      console.error('Error creating payment method:', error);
      throw error;
    }
  }

  async update(id: number, metodo: Partial<MetodoPagoEntity>): Promise<MetodoPagoEntity | null> {
    try {
      const data = await metodoPagoService.update(id.toString(), metodo);
      return MetodoPagoEntity.fromBackend(data);
    } catch (error) {
      console.error('Error updating payment method:', error);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await metodoPagoService.delete(id.toString());
      return true;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      return false;
    }
  }

  async getActive(): Promise<MetodoPagoEntity[]> {
    try {
      const data = await metodoPagoService.getActive();
      return data.map(MetodoPagoEntity.fromBackend);
    } catch (error) {
      console.error('Error fetching active payment methods:', error);
      throw error;
    }
  }
}