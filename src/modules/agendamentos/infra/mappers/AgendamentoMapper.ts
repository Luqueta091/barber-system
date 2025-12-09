import { Agendamento as PrismaAgendamento, Prisma } from '@prisma/client';
import { Agendamento } from '../../domain/entities/Agendamento';

export class AgendamentoMapper {
  static toDomain(record: PrismaAgendamento): Agendamento {
    return new Agendamento({
      id: record.id,
      barbeiroId: record.barbeiroId,
      clienteId: record.clienteId,
      servicoId: record.servicoId,
      dataHoraInicio: record.dataHoraInicio,
      dataHoraFim: record.dataHoraFim,
      status: record.status as Agendamento['status'],
      origem: record.origem,
      observacoes: record.observacoes ?? undefined,
    });
  }

  static toPrisma(agendamento: Agendamento): Prisma.AgendamentoUncheckedCreateInput {
    return {
      id: agendamento.id,
      barbeiroId: agendamento.barbeiroId,
      clienteId: agendamento.clienteId,
      servicoId: agendamento.servicoId,
      dataHoraInicio: agendamento.dataHoraInicio,
      dataHoraFim: agendamento.dataHoraFim,
      status: agendamento.status,
      origem: agendamento.origem,
      observacoes: agendamento.observacoes,
    };
  }

  static toPrismaUpdate(agendamento: Agendamento): Prisma.AgendamentoUncheckedUpdateInput {
    return {
      barbeiroId: agendamento.barbeiroId,
      clienteId: agendamento.clienteId,
      servicoId: agendamento.servicoId,
      dataHoraInicio: agendamento.dataHoraInicio,
      dataHoraFim: agendamento.dataHoraFim,
      status: agendamento.status,
      origem: agendamento.origem,
      observacoes: agendamento.observacoes,
    };
  }
}
