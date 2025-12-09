import { Request, Response } from 'express';
import { z } from 'zod';
import { DomainError } from '@/shared/types/DomainError';
import { PrismaBarbeiroRepository } from '../../infra/repositories/PrismaBarbeiroRepository';
import { PrismaHorarioTrabalhoRepository } from '../../infra/repositories/PrismaHorarioTrabalhoRepository';
import { CadastrarBarbeiro } from '../../domain/use-cases/CadastrarBarbeiro';
import { AtualizarBarbeiro } from '../../domain/use-cases/AtualizarBarbeiro';
import { AtivarInativarBarbeiro } from '../../domain/use-cases/AtivarInativarBarbeiro';
import { ConfigurarHorarioTrabalho } from '../../domain/use-cases/ConfigurarHorarioTrabalho';
import { ListarHorariosTrabalhoDoBarbeiro } from '../../domain/use-cases/ListarHorariosTrabalhoDoBarbeiro';
import { Barbeiro } from '../../domain/entities/Barbeiro';
import { HorarioTrabalho } from '../../domain/entities/HorarioTrabalho';

const barbeiroRepo = new PrismaBarbeiroRepository();
const horarioRepo = new PrismaHorarioTrabalhoRepository();

const cadastrarBarbeiro = new CadastrarBarbeiro(barbeiroRepo);
const atualizarBarbeiro = new AtualizarBarbeiro(barbeiroRepo);
const ativarInativarBarbeiro = new AtivarInativarBarbeiro(barbeiroRepo);
const configurarHorario = new ConfigurarHorarioTrabalho(horarioRepo);
const listarHorarios = new ListarHorariosTrabalhoDoBarbeiro(horarioRepo);

const criarBarbeiroSchema = z.object({
  nome: z.string().min(1),
  telefone: z.string().min(1),
});

const atualizarBarbeiroSchema = z
  .object({
    nome: z.string().min(1).optional(),
    telefone: z.string().min(1).optional(),
  })
  .refine((data) => data.nome !== undefined || data.telefone !== undefined, {
    message: 'Informe nome ou telefone',
  });

const statusSchema = z.object({
  ativo: z.boolean(),
});

const horarioSchema = z.object({
  diaSemana: z.number().int().min(0).max(6),
  horaInicio: z.string().min(1),
  horaFim: z.string().min(1),
});

const toBarbeiroDTO = (barbeiro: Barbeiro) => ({
  id: barbeiro.id,
  nome: barbeiro.nome,
  telefone: barbeiro.telefone,
  ativo: barbeiro.ativo,
});

const toHorarioDTO = (horario: HorarioTrabalho) => ({
  id: horario.id,
  barbeiroId: horario.barbeiroId,
  diaSemana: horario.diaSemana,
  horaInicio: horario.horaInicio,
  horaFim: horario.horaFim,
});

const parseDate = (value: string): Date => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new DomainError('Data/hora inválida', 'INVALID_INPUT');
  }
  return parsed;
};

export class BarbeiroController {
  list = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const barbeiros = await barbeiroRepo.listActive();
      return res.status(200).json(barbeiros.map(toBarbeiroDTO));
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = criarBarbeiroSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const barbeiro = await cadastrarBarbeiro.execute(parsed.data);
      return res.status(201).json(toBarbeiroDTO(barbeiro));
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = atualizarBarbeiroSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const barbeiro = await atualizarBarbeiro.execute({
        id: req.params.id,
        ...parsed.data,
      });

      return res.status(200).json(toBarbeiroDTO(barbeiro));
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

      const barbeiro = await ativarInativarBarbeiro.execute({
        id: req.params.id,
        ativo: parsed.data.ativo,
      });

      return res.status(200).json(toBarbeiroDTO(barbeiro));
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  listHorarios = async (req: Request, res: Response): Promise<Response> => {
    try {
      const diaSemana = req.query.diaSemana ? Number(req.query.diaSemana) : undefined;
      const horarios = await listarHorarios.execute({
        barbeiroId: req.params.id,
        diaSemana: Number.isNaN(diaSemana) ? undefined : diaSemana,
      });

      return res.status(200).json(horarios.map(toHorarioDTO));
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  configurarHorario = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = horarioSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const horario = await configurarHorario.execute({
        barbeiroId: req.params.id,
        diaSemana: parsed.data.diaSemana,
        horaInicio: parseDate(parsed.data.horaInicio),
        horaFim: parseDate(parsed.data.horaFim),
      });

      return res.status(200).json(toHorarioDTO(horario));
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
