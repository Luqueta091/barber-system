import { prisma } from '@/shared/infra/database/prismaClient';
import { IHorarioTrabalhoRepository } from '../../domain/contracts/IHorarioTrabalhoRepository';
import { HorarioTrabalho } from '../../domain/entities/HorarioTrabalho';
import { HorarioTrabalhoMapper } from '../mappers/HorarioTrabalhoMapper';

export class PrismaHorarioTrabalhoRepository implements IHorarioTrabalhoRepository {
  async create(horario: HorarioTrabalho): Promise<HorarioTrabalho> {
    const created = await prisma.horarioTrabalho.create({
      data: HorarioTrabalhoMapper.toPrisma(horario),
    });
    return HorarioTrabalhoMapper.toDomain(created);
  }

  async update(horario: HorarioTrabalho): Promise<HorarioTrabalho> {
    const updated = await prisma.horarioTrabalho.update({
      where: { id: horario.id },
      data: HorarioTrabalhoMapper.toPrismaUpdate(horario),
    });
    return HorarioTrabalhoMapper.toDomain(updated);
  }

  async listByBarbeiro(barbeiroId: string): Promise<HorarioTrabalho[]> {
    const records = await prisma.horarioTrabalho.findMany({
      where: { barbeiroId },
      orderBy: { diaSemana: 'asc' },
    });
    return records.map(HorarioTrabalhoMapper.toDomain);
  }

  async listByBarbeiroAndDia(barbeiroId: string, diaSemana: number): Promise<HorarioTrabalho[]> {
    const records = await prisma.horarioTrabalho.findMany({
      where: { barbeiroId, diaSemana },
      orderBy: { horaInicio: 'asc' },
    });
    return records.map(HorarioTrabalhoMapper.toDomain);
  }
}
