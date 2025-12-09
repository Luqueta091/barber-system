import { Request, Response } from 'express';
import { z } from 'zod';
import { DomainError } from '@/shared/types/DomainError';
import { PrismaAgendamentoRepository } from '../../infra/repositories/PrismaAgendamentoRepository';
import { PrismaClienteRepository } from '@/modules/clientes/infra/repositories/PrismaClienteRepository';
import { PrismaBarbeiroRepository } from '@/modules/barbeiros/infra/repositories/PrismaBarbeiroRepository';
import { PrismaServicoRepository } from '@/modules/servicos/infra/repositories/PrismaServicoRepository';
import { PrismaHorarioTrabalhoRepository } from '@/modules/barbeiros/infra/repositories/PrismaHorarioTrabalhoRepository';
import { ListarHorariosDisponiveis } from '../../domain/use-cases/ListarHorariosDisponiveis';
import { CriarAgendamento } from '../../domain/use-cases/CriarAgendamento';
import { CancelarAgendamentoCliente } from '../../domain/use-cases/CancelarAgendamentoCliente';
import { CancelarAgendamentoBarbeiro } from '../../domain/use-cases/CancelarAgendamentoBarbeiro';
import { MarcarAgendamentoConcluido } from '../../domain/use-cases/MarcarAgendamentoConcluido';
import { RegistrarFaltaAgendamento } from '../../domain/use-cases/RegistrarFaltaAgendamento';
import { RegistrarFaltaCliente } from '@/modules/clientes/domain/use-cases/RegistrarFaltaCliente';
import { ListarAgendaDoDia } from '../../domain/use-cases/ListarAgendaDoDia';
import { Agendamento } from '../../domain/entities/Agendamento';

const agendamentoRepo = new PrismaAgendamentoRepository();
const clienteRepo = new PrismaClienteRepository();
const barbeiroRepo = new PrismaBarbeiroRepository();
const servicoRepo = new PrismaServicoRepository();
const horarioRepo = new PrismaHorarioTrabalhoRepository();
const registrarFaltaCliente = new RegistrarFaltaCliente(clienteRepo);

const listarHorariosDisponiveis = new ListarHorariosDisponiveis(
  servicoRepo,
  horarioRepo,
  agendamentoRepo,
);
const criarAgendamento = new CriarAgendamento(
  agendamentoRepo,
  clienteRepo,
  barbeiroRepo,
  servicoRepo,
);
const cancelarAgendamentoCliente = new CancelarAgendamentoCliente(agendamentoRepo);
const cancelarAgendamentoBarbeiro = new CancelarAgendamentoBarbeiro(agendamentoRepo);
const marcarAgendamentoConcluido = new MarcarAgendamentoConcluido(agendamentoRepo);
const registrarFaltaAgendamento = new RegistrarFaltaAgendamento(
  agendamentoRepo,
  registrarFaltaCliente,
);
const listarAgendaDoDia = new ListarAgendaDoDia(agendamentoRepo, clienteRepo, servicoRepo);

const disponibilidadeSchema = z.object({
  barbeiroId: z.string().min(1),
  servicoId: z.string().min(1),
  data: z.string().min(1),
});

const criarSchema = z.object({
  clienteId: z.string().min(1),
  barbeiroId: z.string().min(1),
  servicoId: z.string().min(1),
  dataHoraInicio: z.string().min(1),
  origem: z.enum(['cliente', 'barbeiro']),
  observacoes: z.string().optional(),
});

const cancelarClienteSchema = z.object({
  clienteId: z.string().min(1),
});

const barbeiroActionSchema = z.object({
  barbeiroId: z.string().min(1),
});

const agendaSchema = z.object({
  data: z.string().min(1),
});

const toDTO = (agendamento: Agendamento) => ({
  id: agendamento.id,
  barbeiroId: agendamento.barbeiroId,
  clienteId: agendamento.clienteId,
  servicoId: agendamento.servicoId,
  dataHoraInicio: agendamento.dataHoraInicio.toISOString(),
  dataHoraFim: agendamento.dataHoraFim.toISOString(),
  status: agendamento.status,
  origem: agendamento.origem,
  observacoes: agendamento.observacoes,
});

const parseDate = (value: string): Date => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new DomainError('Data inválida', 'INVALID_INPUT');
  }
  return date;
};

export class AgendamentoController {
  listarDisponibilidade = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = disponibilidadeSchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const slots = await listarHorariosDisponiveis.execute({
        barbeiroId: parsed.data.barbeiroId,
        servicoId: parsed.data.servicoId,
        data: parseDate(parsed.data.data),
      });

      return res.status(200).json(
        slots.map((slot) => ({
          inicio: slot.inicio.toISOString(),
          fim: slot.fim.toISOString(),
        })),
      );
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = criarSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const agendamento = await criarAgendamento.execute({
        ...parsed.data,
        dataHoraInicio: parseDate(parsed.data.dataHoraInicio),
      });

      return res.status(201).json(toDTO(agendamento));
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  cancelarCliente = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = cancelarClienteSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const agendamento = await cancelarAgendamentoCliente.execute({
        agendamentoId: req.params.id,
        clienteId: parsed.data.clienteId,
      });

      return res.status(200).json(toDTO(agendamento));
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  cancelarBarbeiro = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = barbeiroActionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const agendamento = await cancelarAgendamentoBarbeiro.execute({
        agendamentoId: req.params.id,
        barbeiroId: parsed.data.barbeiroId,
      });

      return res.status(200).json(toDTO(agendamento));
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  concluir = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = barbeiroActionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const agendamento = await marcarAgendamentoConcluido.execute({
        agendamentoId: req.params.id,
        barbeiroId: parsed.data.barbeiroId,
      });

      return res.status(200).json(toDTO(agendamento));
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  marcarFalta = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = barbeiroActionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const agendamento = await registrarFaltaAgendamento.execute({
        agendamentoId: req.params.id,
        barbeiroId: parsed.data.barbeiroId,
      });

      return res.status(200).json(toDTO(agendamento));
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  agendaDoDia = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsedQuery = agendaSchema.safeParse(req.query);
      if (!parsedQuery.success) {
        return res.status(400).json({ error: parsedQuery.error.flatten() });
      }

      const agendamentos = await listarAgendaDoDia.execute({
        barbeiroId: req.params.id,
        data: parseDate(parsedQuery.data.data),
      });

      return res.status(200).json(
        agendamentos.map((item) => ({
          ...toDTO(item.agendamento),
          clienteNome: item.clienteNome,
          clienteTelefone: item.clienteTelefone,
          servicoNome: item.servicoNome,
          servicoDuracaoMinutos: item.servicoDuracaoMinutos,
        })),
      );
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
