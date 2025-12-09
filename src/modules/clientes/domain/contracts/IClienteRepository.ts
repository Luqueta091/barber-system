import { Cliente } from '../entities/Cliente';

export interface IClienteRepository {
  create(cliente: Cliente): Promise<Cliente>;
  update(cliente: Cliente): Promise<Cliente>;
  findById(id: string): Promise<Cliente | null>;
  findByPhone(phone: string): Promise<Cliente | null>;
  incrementFaltas(id: string): Promise<Cliente>;
}
