import { Request, Response } from 'express';
import { z } from 'zod';
import { DomainError } from '../../../../shared/types/DomainError';
import { ClienteResponseDTO } from '../dtos/ClienteResponseDTO';
import { CadastrarCliente } from '../../domain/use-cases/CadastrarCliente';
import { AtualizarCliente } from '../../domain/use-cases/AtualizarCliente';
import { DesbloquearCliente } from '../../domain/use-cases/DesbloquearCliente';
import { PrismaClienteRepository } from '../../infra/repositories/PrismaClienteRepository';
import { Cliente } from '../../domain/entities/Cliente';

const criarClienteSchema = z.object({
  nome: z.string().min(1, 'nome is required'),
  telefone: z.string().min(1, 'telefone is required'),
});

const atualizarClienteSchema = z
  .object({
    nome: z.string().min(1).optional(),
    telefone: z.string().min(1).optional(),
  })
  .refine((data) => data.nome !== undefined || data.telefone !== undefined, {
    message: 'At least one field must be provided',
  });

const clienteRepository = new PrismaClienteRepository();
const cadastrarCliente = new CadastrarCliente(clienteRepository);
const atualizarCliente = new AtualizarCliente(clienteRepository);
const desbloquearCliente = new DesbloquearCliente(clienteRepository);

const toResponseDTO = (cliente: Cliente): ClienteResponseDTO => ({
  id: cliente.id,
  nome: cliente.nome,
  telefone: cliente.telefone,
  faltas: cliente.faltas,
  bloqueado: cliente.bloqueado,
});

export class ClienteController {
  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = criarClienteSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const cliente = await cadastrarCliente.execute(parsed.data);

      return res.status(201).json(toResponseDTO(cliente));
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = atualizarClienteSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const cliente = await atualizarCliente.execute({
        id: req.params.id,
        ...parsed.data,
      });

      return res.status(200).json(toResponseDTO(cliente));
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  desbloquear = async (req: Request, res: Response): Promise<Response> => {
    try {
      const cliente = await desbloquearCliente.execute({
        clienteId: req.params.id,
      });

      return res.status(200).json(toResponseDTO(cliente));
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): Response {
    if (error instanceof DomainError) {
      return res.status(400).json({ code: error.code, message: error.message });
    }

    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
