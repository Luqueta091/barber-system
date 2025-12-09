import { Barbeiro } from '../entities/Barbeiro';

export interface IBarbeiroRepository {
  create(barbeiro: Barbeiro): Promise<Barbeiro>;
  update(barbeiro: Barbeiro): Promise<Barbeiro>;
  findById(id: string): Promise<Barbeiro | null>;
  listActive(): Promise<Barbeiro[]>;
}
