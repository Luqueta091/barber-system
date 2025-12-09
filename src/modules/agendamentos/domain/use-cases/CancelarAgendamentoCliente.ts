import { DomainError } from '@/shared/types/DomainError';
import { IAgendamentoRepository } from '../contracts/IAgendamentoRepository';
import { Agendamento } from '../entities/Agendamento';

interface CancelarAgendamentoClienteInput {
  agendamentoId: string;
  clienteId: string;
}

export class CancelarAgendamentoCliente {
  constructor(private readonly agendamentoRepository: IAgendamentoRepository) {}

  async execute(input: CancelarAgendamentoClienteInput): Promise<Agendamento> {
    const { agendamentoId, clienteId } = input;

    const agendamento = await this.agendamentoRepository.findById(agendamentoId);
    if (!agendamento) {
      throw new DomainError('Agendamento não encontrado', 'AGENDAMENTO_NOT_FOUND');
    }

    if (agendamento.clienteId !== clienteId) {
      throw new DomainError('Agendamento não pertence ao cliente', 'FORBIDDEN');
    }

    agendamento.cancelByCliente();

    return this.agendamentoRepository.update(agendamento);
  }
}
