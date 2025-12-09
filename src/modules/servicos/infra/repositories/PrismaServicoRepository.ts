import { prisma } from '@/shared/infra/database/prismaClient';
import { IServicoRepository } from '../../domain/contracts/IServicoRepository';
import { Servico } from '../../domain/entities/Servico';
import { ServicoMapper } from '../mappers/ServicoMapper';

export class PrismaServicoRepository implements IServicoRepository {
  async create(servico: Servico): Promise<Servico> {
    const created = await prisma.servico.create({
      data: ServicoMapper.toPrisma(servico),
    });
    return ServicoMapper.toDomain(created);
  }

  async update(servico: Servico): Promise<Servico> {
    const updated = await prisma.servico.update({
      where: { id: servico.id },
      data: ServicoMapper.toPrismaUpdate(servico),
    });
    return ServicoMapper.toDomain(updated);
  }

  async findById(id: string): Promise<Servico | null> {
    const record = await prisma.servico.findUnique({ where: { id } });
    return record ? ServicoMapper.toDomain(record) : null;
  }

  async listActive(): Promise<Servico[]> {
    const records = await prisma.servico.findMany({ where: { ativo: true } });
    return records.map(ServicoMapper.toDomain);
  }
}
