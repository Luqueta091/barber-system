import { HorarioTrabalho as PrismaHorarioTrabalho, Prisma } from '@prisma/client';
import { HorarioTrabalho } from '../../domain/entities/HorarioTrabalho';

export class HorarioTrabalhoMapper {
  static toDomain(record: PrismaHorarioTrabalho): HorarioTrabalho {
    return new HorarioTrabalho({
      id: record.id,
      barbeiroId: record.barbeiroId,
      diaSemana: record.diaSemana,
      horaInicio: record.horaInicio,
      horaFim: record.horaFim,
    });
  }

  static toPrisma(horario: HorarioTrabalho): Prisma.HorarioTrabalhoUncheckedCreateInput {
    return {
      id: horario.id,
      barbeiroId: horario.barbeiroId,
      diaSemana: horario.diaSemana,
      horaInicio: horario.horaInicio,
      horaFim: horario.horaFim,
    };
  }

  static toPrismaUpdate(horario: HorarioTrabalho): Prisma.HorarioTrabalhoUncheckedUpdateInput {
    return {
      diaSemana: horario.diaSemana,
      horaInicio: horario.horaInicio,
      horaFim: horario.horaFim,
    };
  }
}
