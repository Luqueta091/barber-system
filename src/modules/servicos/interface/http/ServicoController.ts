import { Request, Response } from 'express';
import { z } from 'zod';
import { DomainError } from '@/shared/types/DomainError';
import { PrismaServicoRepository } from '../../infra/repositories/PrismaServicoRepository';
import { CadastrarServico } from '../../domain/use-cases/CadastrarServico';
import { AtualizarServico } from '../../domain/use-cases/AtualizarServico';
import { AtivarInativarServico } from '../../domain/use-cases/AtivarInativarServico';
import { ListarServicosAtivos } from '../../domain/use-cases/ListarServicosAtivos';
import { Servico } from '../../domain/entities/Servico';

const servicoRepo = new PrismaServicoRepository();
const cadastrarServico = new CadastrarServico(servicoRepo);
const atualizarServico = new AtualizarServico(servicoRepo);
const ativarInativarServico = new AtivarInativarServico(servicoRepo);
const listarServicosAtivos = new ListarServicosAtivos(servicoRepo);

const createSchema = z.object({
  nome: z.string().min(1),
  duracaoMinutos: z.number().int().positive(),
  preco: z.number().nonnegative(),
});

const updateSchema = z
  .object({
    nome: z.string().min(1).optional(),
    duracaoMinutos: z.number().int().positive().optional(),
    preco: z.number().nonnegative().optional(),
  })
  .refine((data) => data.nome !== undefined || data.duracaoMinutos !== undefined || data.preco !== undefined, {
    message: 'Informe pelo menos um campo',
  });

const statusSchema = z.object({
  ativo: z.boolean(),
});

const toDTO = (servico: Servico) => ({
  id: servico.id,
  nome: servico.nome,
  duracaoMinutos: servico.duracaoMinutos,
  preco: servico.preco,
  ativo: servico.ativo,
});

export class ServicoController {
  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = createSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }
      const servico = await cadastrarServico.execute(parsed.data);
      return res.status(201).json(toDTO(servico));
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = updateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const servico = await atualizarServico.execute({
        id: req.params.id,
        ...parsed.data,
      });
      return res.status(200).json(toDTO(servico));
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updateStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = statusSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const servico = await ativarInativarServico.execute({
        id: req.params.id,
        ativo: parsed.data.ativo,
      });
      return res.status(200).json(toDTO(servico));
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  listActive = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const servicos = await listarServicosAtivos.execute();
      return res.status(200).json(servicos.map(toDTO));
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
