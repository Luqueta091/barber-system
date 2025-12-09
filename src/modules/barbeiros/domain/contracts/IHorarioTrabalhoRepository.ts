import { HorarioTrabalho } from '../entities/HorarioTrabalho';

export interface IHorarioTrabalhoRepository {
  create(horario: HorarioTrabalho): Promise<HorarioTrabalho>;
  update(horario: HorarioTrabalho): Promise<HorarioTrabalho>;
  listByBarbeiro(barbeiroId: string): Promise<HorarioTrabalho[]>;
  listByBarbeiroAndDia(barbeiroId: string, diaSemana: number): Promise<HorarioTrabalho[]>;
}
