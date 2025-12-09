import { DomainError } from '@/shared/types/DomainError';
import { IBarbeiroRepository } from '../contracts/IBarbeiroRepository';
import { Barbeiro } from '../entities/Barbeiro';

interface AtivarInativarBarbeiroInput {
  id: string;
  ativo: boolean;
}

export class AtivarInativarBarbeiro {
  constructor(private readonly barbeiroRepository: IBarbeiroRepository) {}

  async execute(input: AtivarInativarBarbeiroInput): Promise<Barbeiro> {
    const { id, ativo } = input;

    const barbeiro = await this.barbeiroRepository.findById(id);

    if (!barbeiro) {
      throw new DomainError('Barbeiro não encontrado', 'BARBEIRO_NOT_FOUND');
    }

    if (ativo) {
      barbeiro.ativar();
    } else {
      barbeiro.desativar();
    }

    return this.barbeiroRepository.update(barbeiro);
  }
}
