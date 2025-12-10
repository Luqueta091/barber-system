import { DomainError } from '@/shared/types/DomainError';
import { IAgendamentoRepository } from '../contracts/IAgendamentoRepository';

interface Input {
  agendamentoId: string;
  barbeiroId: string;
}

export class ApagarAgendamento {
  constructor(private readonly agendamentoRepository: IAgendamentoRepository) {}

  async execute({ agendamentoId, barbeiroId }: Input): Promise<void> {
    const agendamento = await this.agendamentoRepository.findById(agendamentoId);
    if (!agendamento) {
      throw new DomainError('Agendamento não encontrado', 'APPOINTMENT_NOT_FOUND');
    }

    if (agendamento.barbeiroId !== barbeiroId) {
      throw new DomainError('Barbeiro não autorizado a apagar este agendamento', 'FORBIDDEN');
    }

    const podeApagar =
      agendamento.status === 'CANCELADO_CLIENTE' || agendamento.status === 'CANCELADO_BARBEIRO';
    if (!podeApagar) {
      throw new DomainError(
        'Só é possível apagar agendamentos cancelados',
        'APPOINTMENT_NOT_CANCELLED',
      );
    }

    await this.agendamentoRepository.delete(agendamentoId);
  }
}
