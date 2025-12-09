import { Barbeiro as PrismaBarbeiro, Prisma } from '@prisma/client';
import { Barbeiro } from '../../domain/entities/Barbeiro';

export class BarbeiroMapper {
  static toDomain(record: PrismaBarbeiro): Barbeiro {
    return new Barbeiro({
      id: record.id,
      nome: record.nome,
      telefone: record.telefone,
      ativo: record.ativo,
    });
  }

  static toPrisma(barbeiro: Barbeiro): Prisma.BarbeiroUncheckedCreateInput {
    return {
      id: barbeiro.id,
      nome: barbeiro.nome,
      telefone: barbeiro.telefone,
      ativo: barbeiro.ativo,
      corAgenda: undefined,
    };
  }

  static toPrismaUpdate(barbeiro: Barbeiro): Prisma.BarbeiroUncheckedUpdateInput {
    return {
      nome: barbeiro.nome,
      telefone: barbeiro.telefone,
      ativo: barbeiro.ativo,
      corAgenda: undefined,
    };
  }
}
