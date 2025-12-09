import { DomainError } from '@/shared/types/DomainError';
import { RegistrarFaltaCliente } from '@/modules/clientes/domain/use-cases/RegistrarFaltaCliente';
import { IAgendamentoRepository } from '../contracts/IAgendamentoRepository';
import { Agendamento } from '../entities/Agendamento';

interface RegistrarFaltaAgendamentoInput {
  agendamentoId: string;
  barbeiroId: string;
  limitFaltas?: number;
}

export class RegistrarFaltaAgendamento {
  constructor(
    private readonly agendamentoRepository: IAgendamentoRepository,
    private readonly registrarFaltaCliente: RegistrarFaltaCliente,
  ) {}

  async execute(input: RegistrarFaltaAgendamentoInput): Promise<Agendamento> {
    const { agendamentoId, barbeiroId, limitFaltas } = input;

    const agendamento = await this.agendamentoRepository.findById(agendamentoId);
    if (!agendamento) {
      throw new DomainError('Agendamento não encontrado', 'AGENDAMENTO_NOT_FOUND');
    }

    if (agendamento.barbeiroId !== barbeiroId) {
      throw new DomainError('Agendamento não pertence ao barbeiro', 'FORBIDDEN');
    }

    agendamento.markFalta();

    const atualizado = await this.agendamentoRepository.update(agendamento);

    await this.registrarFaltaCliente.execute({
      clienteId: agendamento.clienteId,
      limitFaltas,
    });

    return atualizado;
  }
}
