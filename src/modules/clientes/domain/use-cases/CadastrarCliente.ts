import { DomainError } from '../../../../shared/types/DomainError';
import { isNonEmptyString } from '../../../../shared/utils/validationUtils';
import { IClienteRepository } from '../contracts/IClienteRepository';
import { Cliente } from '../entities/Cliente';

interface CadastrarClienteInput {
  nome: string;
  telefone: string;
}

export class CadastrarCliente {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(input: CadastrarClienteInput): Promise<Cliente> {
    const { nome, telefone } = input;

    if (!isNonEmptyString(nome) || !isNonEmptyString(telefone)) {
      throw new DomainError('Name and phone are required', 'INVALID_INPUT');
    }

    const existing = await this.clienteRepository.findByPhone(telefone);

    if (existing) {
      throw new DomainError('Client with this phone already exists', 'CLIENT_ALREADY_EXISTS');
    }

    const cliente = new Cliente({
      nome: nome.trim(),
      telefone: telefone.trim(),
      faltas: 0,
      bloqueado: false,
    });

    return this.clienteRepository.create(cliente);
  }
}
