import { DomainError } from '@/shared/types/DomainError';
import { IAgendamentoRepository } from '../contracts/IAgendamentoRepository';
import { Agendamento } from '../entities/Agendamento';

interface Input {
  clienteId: string;
  onlyFuture?: boolean;
}

export class ListarAgendamentosDoCliente {
  constructor(private readonly agendamentoRepository: IAgendamentoRepository) {}

  async execute({ clienteId, onlyFuture }: Input): Promise<Agendamento[]> {
    if (!clienteId) {
      throw new DomainError('ClienteId é obrigatório', 'INVALID_INPUT');
    }

    const agendamentos = await this.agendamentoRepository.findForCliente(clienteId);

    if (onlyFuture) {
      const now = new Date();
      return agendamentos.filter((ag) => ag.dataHoraInicio > now);
    }

    return agendamentos;
  }
}
