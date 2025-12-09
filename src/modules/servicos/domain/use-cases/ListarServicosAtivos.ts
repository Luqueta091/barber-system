import { IServicoRepository } from '../contracts/IServicoRepository';
import { Servico } from '../entities/Servico';

export class ListarServicosAtivos {
  constructor(private readonly servicoRepository: IServicoRepository) {}

  async execute(): Promise<Servico[]> {
    return this.servicoRepository.listActive();
  }
}
