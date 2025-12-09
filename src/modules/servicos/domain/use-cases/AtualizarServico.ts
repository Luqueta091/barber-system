import { DomainError } from '@/shared/types/DomainError';
import { isNonEmptyString } from '@/shared/utils/validationUtils';
import { IServicoRepository } from '../contracts/IServicoRepository';
import { Servico } from '../entities/Servico';

interface AtualizarServicoInput {
  id: string;
  nome?: string;
  duracaoMinutos?: number;
  preco?: number;
}

export class AtualizarServico {
  constructor(private readonly servicoRepository: IServicoRepository) {}

  async execute(input: AtualizarServicoInput): Promise<Servico> {
    const { id, nome, duracaoMinutos, preco } = input;

    if (!isNonEmptyString(id)) {
      throw new DomainError('Serviço id é obrigatório', 'INVALID_INPUT');
    }

    const servico = await this.servicoRepository.findById(id);

    if (!servico) {
      throw new DomainError('Serviço não encontrado', 'SERVICO_NOT_FOUND');
    }

    if (nome !== undefined) {
      if (!isNonEmptyString(nome)) {
        throw new DomainError('Nome inválido', 'INVALID_INPUT');
      }
      servico.nome = nome.trim();
    }

    if (duracaoMinutos !== undefined) {
      if (!Number.isFinite(duracaoMinutos) || duracaoMinutos <= 0) {
        throw new DomainError('Duração deve ser maior que zero', 'INVALID_INPUT');
      }
      servico.duracaoMinutos = duracaoMinutos;
    }

    if (preco !== undefined) {
      if (!Number.isFinite(preco) || preco < 0) {
        throw new DomainError('Preço deve ser não negativo', 'INVALID_INPUT');
      }
      servico.preco = preco;
    }

    return this.servicoRepository.update(servico);
  }
}
