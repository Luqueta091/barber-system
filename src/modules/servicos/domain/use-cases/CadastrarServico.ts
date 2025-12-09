import { DomainError } from '@/shared/types/DomainError';
import { isNonEmptyString } from '@/shared/utils/validationUtils';
import { IServicoRepository } from '../contracts/IServicoRepository';
import { Servico } from '../entities/Servico';

interface CadastrarServicoInput {
  nome: string;
  duracaoMinutos: number;
  preco: number;
}

export class CadastrarServico {
  constructor(private readonly servicoRepository: IServicoRepository) {}

  async execute(input: CadastrarServicoInput): Promise<Servico> {
    const { nome, duracaoMinutos, preco } = input;

    if (!isNonEmptyString(nome)) {
      throw new DomainError('Nome é obrigatório', 'INVALID_INPUT');
    }
    if (!Number.isFinite(duracaoMinutos) || duracaoMinutos <= 0) {
      throw new DomainError('Duração deve ser maior que zero', 'INVALID_INPUT');
    }
    if (!Number.isFinite(preco) || preco < 0) {
      throw new DomainError('Preço deve ser não negativo', 'INVALID_INPUT');
    }

    const servico = new Servico({
      nome: nome.trim(),
      duracaoMinutos,
      preco,
      ativo: true,
    });

    return this.servicoRepository.create(servico);
  }
}
