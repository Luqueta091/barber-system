import { DomainError } from '../../../../shared/types/DomainError';
import { isNonEmptyString } from '../../../../shared/utils/validationUtils';
import { IClienteRepository } from '../contracts/IClienteRepository';
import { Cliente } from '../entities/Cliente';

interface AtualizarClienteInput {
  id: string;
  nome?: string;
  telefone?: string;
}

export class AtualizarCliente {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(input: AtualizarClienteInput): Promise<Cliente> {
    const { id, nome, telefone } = input;

    if (!isNonEmptyString(id)) {
      throw new DomainError('Client id is required', 'INVALID_INPUT');
    }

    const cliente = await this.clienteRepository.findById(id);

    if (!cliente) {
      throw new DomainError('Client not found', 'CLIENT_NOT_FOUND');
    }

    if (nome !== undefined) {
      if (!isNonEmptyString(nome)) {
        throw new DomainError('Name cannot be empty', 'INVALID_INPUT');
      }
      cliente.updateNome(nome.trim());
    }

    if (telefone !== undefined) {
      if (!isNonEmptyString(telefone)) {
        throw new DomainError('Phone cannot be empty', 'INVALID_INPUT');
      }
      cliente.updateTelefone(telefone.trim());
    }

    if (nome === undefined && telefone === undefined) {
      return cliente;
    }

    return this.clienteRepository.update(cliente);
  }
}
