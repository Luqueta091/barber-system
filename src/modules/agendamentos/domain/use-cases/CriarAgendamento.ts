import { DomainError } from '@/shared/types/DomainError';
import { addMinutes } from '@/shared/utils/dateUtils';
import { isValidLeadTime } from '../rules/ValidadorAntecedencia';
import { IAgendamentoRepository } from '../contracts/IAgendamentoRepository';
import { IClienteRepository } from '@/modules/clientes/domain/contracts/IClienteRepository';
import { IBarbeiroRepository } from '@/modules/barbeiros/domain/contracts/IBarbeiroRepository';
import { IServicoRepository } from '@/modules/servicos/domain/contracts/IServicoRepository';
import { Agendamento } from '../entities/Agendamento';

interface CriarAgendamentoInput {
  clienteId: string;
  barbeiroId: string;
  servicoId: string;
  dataHoraInicio: Date;
  origem: string;
  observacoes?: string;
  minLeadTimeMinutes?: number;
}

export class CriarAgendamento {
  constructor(
    private readonly agendamentoRepository: IAgendamentoRepository,
    private readonly clienteRepository: IClienteRepository,
    private readonly barbeiroRepository: IBarbeiroRepository,
    private readonly servicoRepository: IServicoRepository,
  ) {}

  async execute(input: CriarAgendamentoInput): Promise<Agendamento> {
    const {
      clienteId,
      barbeiroId,
      servicoId,
      dataHoraInicio,
      origem,
      observacoes,
      minLeadTimeMinutes = 60,
    } = input;

    const cliente = await this.clienteRepository.findById(clienteId);
    if (!cliente) {
      throw new DomainError('Cliente não encontrado', 'CLIENT_NOT_FOUND');
    }
    if (cliente.bloqueado) {
      throw new DomainError('Cliente bloqueado', 'CLIENT_BLOCKED');
    }

    const barbeiro = await this.barbeiroRepository.findById(barbeiroId);
    if (!barbeiro || !barbeiro.ativo) {
      throw new DomainError('Barbeiro não encontrado ou inativo', 'BARBEIRO_NOT_FOUND');
    }

    const servico = await this.servicoRepository.findById(servicoId);
    if (!servico || !servico.ativo) {
      throw new DomainError('Serviço não encontrado ou inativo', 'SERVICO_NOT_FOUND');
    }

    const sameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    if (!isValidLeadTime(dataHoraInicio, minLeadTimeMinutes)) {
      throw new DomainError('Agendamento deve respeitar a antecedência mínima', 'INVALID_LEAD_TIME');
    }

    const dataHoraFim = addMinutes(dataHoraInicio, servico.duracaoMinutos);

    // Limita a 1 agendamento por dia para o cliente (considerando apenas confirmados)
    const agendamentosDoCliente = await this.agendamentoRepository.findForCliente(clienteId);
    const jaPossuiMesmoDia = agendamentosDoCliente.some((ag) => {
      const bloqueiaStatus = ['CONFIRMADO', 'CONCLUIDO', 'FALTA'];
      return bloqueiaStatus.includes(ag.status) && sameDay(ag.dataHoraInicio, dataHoraInicio);
    });
    if (jaPossuiMesmoDia) {
      throw new DomainError(
        'Cliente já possui um agendamento confirmado neste dia',
        'CLIENT_ALREADY_HAS_APPOINTMENT_DAY',
      );
    }

    const conflitos = await this.agendamentoRepository.findConflicting(
      barbeiroId,
      dataHoraInicio,
      dataHoraFim,
    );

    if (conflitos.length > 0) {
      throw new DomainError('Horário indisponível', 'CONFLICT');
    }

    const agendamento = new Agendamento({
      barbeiroId,
      clienteId,
      servicoId,
      dataHoraInicio,
      dataHoraFim,
      status: 'CONFIRMADO',
      origem,
      observacoes,
    });

    return this.agendamentoRepository.create(agendamento);
  }
}
