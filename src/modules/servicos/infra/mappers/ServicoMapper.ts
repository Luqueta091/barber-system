import { Prisma, Servico as PrismaServico } from '@prisma/client';
import { Servico } from '../../domain/entities/Servico';

export class ServicoMapper {
  static toDomain(record: PrismaServico): Servico {
    return new Servico({
      id: record.id,
      nome: record.nome,
      duracaoMinutos: record.duracaoMinutos,
      preco: Number(record.preco),
      ativo: record.ativo,
    });
  }

  static toPrisma(servico: Servico): Prisma.ServicoUncheckedCreateInput {
    return {
      id: servico.id,
      nome: servico.nome,
      duracaoMinutos: servico.duracaoMinutos,
      preco: servico.preco,
      ativo: servico.ativo,
    };
  }

  static toPrismaUpdate(servico: Servico): Prisma.ServicoUncheckedUpdateInput {
    return {
      nome: servico.nome,
      duracaoMinutos: servico.duracaoMinutos,
      preco: servico.preco,
      ativo: servico.ativo,
    };
  }
}
