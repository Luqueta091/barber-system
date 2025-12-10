import { prisma } from '@/shared/infra/database/prismaClient';
import { IBarbeiroRepository } from '../../domain/contracts/IBarbeiroRepository';
import { Barbeiro } from '../../domain/entities/Barbeiro';
import { BarbeiroMapper } from '../mappers/BarbeiroMapper';

export class PrismaBarbeiroRepository implements IBarbeiroRepository {
  async create(barbeiro: Barbeiro): Promise<Barbeiro> {
    const created = await prisma.barbeiro.create({
      data: BarbeiroMapper.toPrisma(barbeiro),
    });
    return BarbeiroMapper.toDomain(created);
  }

  async update(barbeiro: Barbeiro): Promise<Barbeiro> {
    const updated = await prisma.barbeiro.update({
      where: { id: barbeiro.id },
      data: BarbeiroMapper.toPrismaUpdate(barbeiro),
    });
    return BarbeiroMapper.toDomain(updated);
  }

  async findById(id: string): Promise<Barbeiro | null> {
    const record = await prisma.barbeiro.findUnique({
      where: { id },
    });
    return record ? BarbeiroMapper.toDomain(record) : null;
  }

  async listActive(): Promise<Barbeiro[]> {
    const records = await prisma.barbeiro.findMany({
      orderBy: { nome: 'asc' },
    });
    return records.map(BarbeiroMapper.toDomain);
  }
}
