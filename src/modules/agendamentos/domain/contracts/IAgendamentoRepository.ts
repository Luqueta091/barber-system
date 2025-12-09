import { Agendamento } from '../entities/Agendamento';

export interface IAgendamentoRepository {
  create(agendamento: Agendamento): Promise<Agendamento>;
  update(agendamento: Agendamento): Promise<Agendamento>;
  findById(id: string): Promise<Agendamento | null>;
  findForBarbeiroOnDay(barbeiroId: string, date: Date): Promise<Agendamento[]>;
  findConflicting(barbeiroId: string, start: Date, end: Date): Promise<Agendamento[]>;
}
