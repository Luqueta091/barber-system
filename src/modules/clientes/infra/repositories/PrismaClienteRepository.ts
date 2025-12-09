import { prisma } from '@/shared/infra/database/prismaClient';
import { IClienteRepository } from '../../domain/contracts/IClienteRepository';
import { Cliente } from '../../domain/entities/Cliente';
import { ClienteMapper } from '../mappers/ClienteMapper';

export class PrismaClienteRepository implements IClienteRepository {
  async create(cliente: Cliente): Promise<Cliente> {
    const created = await prisma.cliente.create({
      data: ClienteMapper.toPrisma(cliente),
    });
    return ClienteMapper.toDomain(created);
  }

  async update(cliente: Cliente): Promise<Cliente> {
    const updated = await prisma.cliente.update({
      where: { id: cliente.id },
      data: ClienteMapper.toPrismaUpdate(cliente),
    });
    return ClienteMapper.toDomain(updated);
  }

  async findById(id: string): Promise<Cliente | null> {
    const found = await prisma.cliente.findUnique({
      where: { id },
    });
    return found ? ClienteMapper.toDomain(found) : null;
  }

  async findByPhone(phone: string): Promise<Cliente | null> {
    const found = await prisma.cliente.findFirst({
      where: { telefone: phone },
    });
    return found ? ClienteMapper.toDomain(found) : null;
  }

  async incrementFaltas(id: string): Promise<Cliente> {
    const updated = await prisma.cliente.update({
      where: { id },
      data: {
        faltas: { increment: 1 },
      },
    });
    return ClienteMapper.toDomain(updated);
  }
}
