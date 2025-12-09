import { DomainError } from '@/shared/types/DomainError';
import { IAgendamentoRepository } from '../contracts/IAgendamentoRepository';
import { Agendamento } from '../entities/Agendamento';

interface MarcarAgendamentoConcluidoInput {
  agendamentoId: string;
  barbeiroId: string;
}

export class MarcarAgendamentoConcluido {
  constructor(private readonly agendamentoRepository: IAgendamentoRepository) {}

  async execute(input: MarcarAgendamentoConcluidoInput): Promise<Agendamento> {
    const { agendamentoId, barbeiroId } = input;

    const agendamento = await this.agendamentoRepository.findById(agendamentoId);
    if (!agendamento) {
      throw new DomainError('Agendamento não encontrado', 'AGENDAMENTO_NOT_FOUND');
    }

    if (agendamento.barbeiroId !== barbeiroId) {
      throw new DomainError('Agendamento não pertence ao barbeiro', 'FORBIDDEN');
    }

    agendamento.markConcluido();

    return this.agendamentoRepository.update(agendamento);
  }
}
