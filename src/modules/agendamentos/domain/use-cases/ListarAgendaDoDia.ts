import { IAgendamentoRepository } from '../contracts/IAgendamentoRepository';
import { Agendamento } from '../entities/Agendamento';
import { IClienteRepository } from '@/modules/clientes/domain/contracts/IClienteRepository';
import { IServicoRepository } from '@/modules/servicos/domain/contracts/IServicoRepository';

interface ListarAgendaDoDiaInput {
  barbeiroId: string;
  data: Date;
}

export interface AgendaDoDiaItem {
  agendamento: Agendamento;
  clienteNome?: string;
  clienteTelefone?: string;
  servicoNome?: string;
  servicoDuracaoMinutos?: number;
}

export class ListarAgendaDoDia {
  constructor(
    private readonly agendamentoRepository: IAgendamentoRepository,
    private readonly clienteRepository: IClienteRepository,
    private readonly servicoRepository: IServicoRepository,
  ) {}

  async execute(input: ListarAgendaDoDiaInput): Promise<AgendaDoDiaItem[]> {
    const { barbeiroId, data } = input;
    const agendamentos = await this.agendamentoRepository.findForBarbeiroOnDay(barbeiroId, data);

    const ordered = agendamentos.sort(
      (a, b) => a.dataHoraInicio.getTime() - b.dataHoraInicio.getTime(),
    );

    const items: AgendaDoDiaItem[] = [];
    for (const agendamento of ordered) {
      const cliente = await this.clienteRepository.findById(agendamento.clienteId);
      const servico = await this.servicoRepository.findById(agendamento.servicoId);

      items.push({
        agendamento,
        clienteNome: cliente?.nome,
        clienteTelefone: cliente?.telefone,
        servicoNome: servico?.nome,
        servicoDuracaoMinutos: servico?.duracaoMinutos,
      });
    }

    return items;
  }
}
