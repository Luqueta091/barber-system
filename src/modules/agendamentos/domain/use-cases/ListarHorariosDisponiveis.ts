import { DomainError } from '@/shared/types/DomainError';
import { calculateSlots } from '../rules/CalculadorDeSlots';
import { IAgendamentoRepository } from '../contracts/IAgendamentoRepository';
import { IServicoRepository } from '@/modules/servicos/domain/contracts/IServicoRepository';
import { IHorarioTrabalhoRepository } from '@/modules/barbeiros/domain/contracts/IHorarioTrabalhoRepository';

interface ListarHorariosDisponiveisInput {
  barbeiroId: string;
  servicoId: string;
  data: Date;
  minLeadTimeMinutes?: number;
}

export class ListarHorariosDisponiveis {
  constructor(
    private readonly servicoRepository: IServicoRepository,
    private readonly horarioRepository: IHorarioTrabalhoRepository,
    private readonly agendamentoRepository: IAgendamentoRepository,
  ) {}

  async execute(input: ListarHorariosDisponiveisInput) {
    const { barbeiroId, servicoId, data, minLeadTimeMinutes = 60 } = input;

    const servico = await this.servicoRepository.findById(servicoId);
    if (!servico || !servico.ativo) {
      throw new DomainError('Serviço não encontrado ou inativo', 'SERVICO_NOT_FOUND');
    }

    const diaSemana = data.getDay();
    const horarios = await this.horarioRepository.listByBarbeiroAndDia(barbeiroId, diaSemana);

    if (horarios.length === 0) {
      return [];
    }

    const agendamentosExistentes =
      await this.agendamentoRepository.findForBarbeiroOnDay(barbeiroId, data);

    return calculateSlots({
      horariosTrabalho: horarios,
      duracaoMinutos: servico.duracaoMinutos,
      agendamentosExistentes,
      data,
      minLeadTimeMinutes,
    });
  }
}
