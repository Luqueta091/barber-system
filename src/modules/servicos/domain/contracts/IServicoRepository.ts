import { Servico } from '../entities/Servico';

export interface IServicoRepository {
  create(servico: Servico): Promise<Servico>;
  update(servico: Servico): Promise<Servico>;
  findById(id: string): Promise<Servico | null>;
  listActive(): Promise<Servico[]>;
}
