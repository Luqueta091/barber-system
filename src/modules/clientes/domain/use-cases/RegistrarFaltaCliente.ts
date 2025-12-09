import { DomainError } from '../../../../shared/types/DomainError';
import { IClienteRepository } from '../contracts/IClienteRepository';
import { Cliente } from '../entities/Cliente';
import { shouldBlockClient } from '../rules/RegraDeBloqueioPorFaltas';

interface RegistrarFaltaClienteInput {
  clienteId: string;
  limitFaltas?: number;
}

export class RegistrarFaltaCliente {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(input: RegistrarFaltaClienteInput): Promise<Cliente> {
    const { clienteId, limitFaltas = 3 } = input;

    const cliente = await this.clienteRepository.findById(clienteId);

    if (!cliente) {
      throw new DomainError('Client not found', 'CLIENT_NOT_FOUND');
    }

    cliente.incrementFaltas();

    if (shouldBlockClient(cliente.faltas, limitFaltas)) {
      cliente.block();
    }

    return this.clienteRepository.update(cliente);
  }
}
