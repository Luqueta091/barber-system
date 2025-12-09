import { DomainError } from '@/shared/types/DomainError';
import { IServicoRepository } from '../contracts/IServicoRepository';
import { Servico } from '../entities/Servico';

interface AtivarInativarServicoInput {
  id: string;
  ativo: boolean;
}

export class AtivarInativarServico {
  constructor(private readonly servicoRepository: IServicoRepository) {}

  async execute(input: AtivarInativarServicoInput): Promise<Servico> {
    const { id, ativo } = input;

    const servico = await this.servicoRepository.findById(id);
    if (!servico) {
      throw new DomainError('Serviço não encontrado', 'SERVICO_NOT_FOUND');
    }

    servico.ativo = ativo;
    return this.servicoRepository.update(servico);
  }
}
