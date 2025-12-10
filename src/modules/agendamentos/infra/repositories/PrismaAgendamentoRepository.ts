import { prisma } from '@/shared/infra/database/prismaClient';
import { IAgendamentoRepository } from '../../domain/contracts/IAgendamentoRepository';
import { Agendamento } from '../../domain/entities/Agendamento';
import { AgendamentoMapper } from '../mappers/AgendamentoMapper';

const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export class PrismaAgendamentoRepository implements IAgendamentoRepository {
  async create(agendamento: Agendamento): Promise<Agendamento> {
    const created = await prisma.agendamento.create({
      data: AgendamentoMapper.toPrisma(agendamento),
    });
    return AgendamentoMapper.toDomain(created);
  }

  async update(agendamento: Agendamento): Promise<Agendamento> {
    const updated = await prisma.agendamento.update({
      where: { id: agendamento.id },
      data: AgendamentoMapper.toPrismaUpdate(agendamento),
    });
    return AgendamentoMapper.toDomain(updated);
  }

  async findById(id: string): Promise<Agendamento | null> {
    const record = await prisma.agendamento.findUnique({ where: { id } });
    return record ? AgendamentoMapper.toDomain(record) : null;
  }

  async findForBarbeiroOnDay(barbeiroId: string, date: Date): Promise<Agendamento[]> {
    const inicio = startOfDay(date);
    const fim = endOfDay(date);

    const records = await prisma.agendamento.findMany({
      where: {
        barbeiroId,
        dataHoraInicio: { gte: inicio, lte: fim },
      },
      orderBy: { dataHoraInicio: 'asc' },
    });

    return records.map(AgendamentoMapper.toDomain);
  }

  async findConflicting(barbeiroId: string, start: Date, end: Date): Promise<Agendamento[]> {
    const records = await prisma.agendamento.findMany({
      where: {
        barbeiroId,
        status: 'CONFIRMADO',
        dataHoraInicio: { lt: end },
        dataHoraFim: { gt: start },
      },
    });
    return records.map(AgendamentoMapper.toDomain);
  }

  async findForCliente(clienteId: string): Promise<Agendamento[]> {
    const records = await prisma.agendamento.findMany({
      where: { clienteId },
      orderBy: { dataHoraInicio: 'asc' },
    });
    return records.map(AgendamentoMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await prisma.agendamento.delete({ where: { id } });
  }
}
