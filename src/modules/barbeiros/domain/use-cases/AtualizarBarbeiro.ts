import { DomainError } from '@/shared/types/DomainError';
import { isNonEmptyString } from '@/shared/utils/validationUtils';
import { IBarbeiroRepository } from '../contracts/IBarbeiroRepository';
import { Barbeiro } from '../entities/Barbeiro';

interface AtualizarBarbeiroInput {
  id: string;
  nome?: string;
  telefone?: string;
}

export class AtualizarBarbeiro {
  constructor(private readonly barbeiroRepository: IBarbeiroRepository) {}

  async execute(input: AtualizarBarbeiroInput): Promise<Barbeiro> {
    const { id, nome, telefone } = input;

    if (!isNonEmptyString(id)) {
      throw new DomainError('Barbeiro id é obrigatório', 'INVALID_INPUT');
    }

    const barbeiro = await this.barbeiroRepository.findById(id);

    if (!barbeiro) {
      throw new DomainError('Barbeiro não encontrado', 'BARBEIRO_NOT_FOUND');
    }

    if (nome !== undefined) {
      if (!isNonEmptyString(nome)) {
        throw new DomainError('Nome inválido', 'INVALID_INPUT');
      }
      barbeiro.atualizarNome(nome.trim());
    }

    if (telefone !== undefined) {
      if (!isNonEmptyString(telefone)) {
        throw new DomainError('Telefone inválido', 'INVALID_INPUT');
      }
      barbeiro.atualizarTelefone(telefone.trim());
    }

    return this.barbeiroRepository.update(barbeiro);
  }
}
