import { DomainError } from '@/shared/types/DomainError';
import { isNonEmptyString } from '@/shared/utils/validationUtils';
import { IClienteRepository } from '../contracts/IClienteRepository';
import { Cliente } from '../entities/Cliente';

interface Input {
  nome?: string;
  telefone: string;
}

export class LoginCliente {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(input: Input): Promise<Cliente> {
    const { nome, telefone } = input;

    if (!isNonEmptyString(telefone)) {
      throw new DomainError('Telefone é obrigatório', 'INVALID_INPUT');
    }

    const existing = await this.clienteRepository.findByPhone(telefone.trim());
    if (existing) {
      if (nome && isNonEmptyString(nome) && nome.trim() !== existing.nome) {
        existing.nome = nome.trim();
        return this.clienteRepository.update(existing);
      }
      return existing;
    }

    const cliente = new Cliente({
      nome: isNonEmptyString(nome) ? nome.trim() : 'Cliente',
      telefone: telefone.trim(),
      faltas: 0,
      bloqueado: false,
    });

    return this.clienteRepository.create(cliente);
  }
}
