import { DomainError } from '../../../../shared/types/DomainError';
import { IClienteRepository } from '../contracts/IClienteRepository';
import { Cliente } from '../entities/Cliente';

interface DesbloquearClienteInput {
  clienteId: string;
}

export class DesbloquearCliente {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(input: DesbloquearClienteInput): Promise<Cliente> {
    const { clienteId } = input;

    const cliente = await this.clienteRepository.findById(clienteId);

    if (!cliente) {
      throw new DomainError('Client not found', 'CLIENT_NOT_FOUND');
    }

    cliente.unblock();

    return this.clienteRepository.update(cliente);
  }
}
