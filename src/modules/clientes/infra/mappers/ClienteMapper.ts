import { Cliente as PrismaCliente, Prisma } from '@prisma/client';
import { Cliente } from '../../domain/entities/Cliente';

export class ClienteMapper {
  static toDomain(prismaCliente: PrismaCliente): Cliente {
    return new Cliente({
      id: prismaCliente.id,
      nome: prismaCliente.nome,
      telefone: prismaCliente.telefone,
      faltas: prismaCliente.faltas,
      bloqueado: prismaCliente.bloqueado,
    });
  }

  static toPrisma(cliente: Cliente): Prisma.ClienteUncheckedCreateInput {
    return {
      id: cliente.id,
      nome: cliente.nome,
      telefone: cliente.telefone,
      faltas: cliente.faltas,
      bloqueado: cliente.bloqueado,
    };
  }

  static toPrismaUpdate(cliente: Cliente): Prisma.ClienteUncheckedUpdateInput {
    return {
      nome: cliente.nome,
      telefone: cliente.telefone,
      faltas: cliente.faltas,
      bloqueado: cliente.bloqueado,
    };
  }
}
