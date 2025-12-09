import { DomainError } from '@/shared/types/DomainError';
import { isNonEmptyString } from '@/shared/utils/validationUtils';
import { IBarbeiroRepository } from '../contracts/IBarbeiroRepository';
import { Barbeiro } from '../entities/Barbeiro';

interface CadastrarBarbeiroInput {
  nome: string;
  telefone: string;
}

export class CadastrarBarbeiro {
  constructor(private readonly barbeiroRepository: IBarbeiroRepository) {}

  async execute(input: CadastrarBarbeiroInput): Promise<Barbeiro> {
    const { nome, telefone } = input;

    if (!isNonEmptyString(nome) || !isNonEmptyString(telefone)) {
      throw new DomainError('Nome e telefone são obrigatórios', 'INVALID_INPUT');
    }

    const barbeiro = new Barbeiro({
      nome: nome.trim(),
      telefone: telefone.trim(),
      ativo: true,
    });

    return this.barbeiroRepository.create(barbeiro);
  }
}
