import { DomainError } from '@/shared/types/DomainError';
import { CriarAgendamento } from '@/modules/agendamentos/domain/use-cases/CriarAgendamento';
import { Agendamento } from '@/modules/agendamentos/domain/entities/Agendamento';

const makeDate = (iso: string) => new Date(iso);

describe('CriarAgendamento', () => {
  const baseCliente = { id: 'c1', bloqueado: false };
  const baseBarbeiro = { id: 'b1', ativo: true };
  const baseServico = { id: 's1', ativo: true, duracaoMinutos: 60 };

  const buildUseCase = (overrides?: {
    cliente?: Partial<typeof baseCliente>;
    barbeiro?: Partial<typeof baseBarbeiro>;
    servico?: Partial<typeof baseServico>;
    conflitos?: Agendamento[];
  }) => {
    const clienteRepo = {
      findById: jest.fn().mockResolvedValue({ ...baseCliente, ...overrides?.cliente }),
    } as any;
    const barbeiroRepo = {
      findById: jest.fn().mockResolvedValue({ ...baseBarbeiro, ...overrides?.barbeiro }),
    } as any;
    const servicoRepo = {
      findById: jest.fn().mockResolvedValue({ ...baseServico, ...overrides?.servico }),
    } as any;
    const agendamentoRepo = {
      findConflicting: jest.fn().mockResolvedValue(overrides?.conflitos ?? []),
      create: jest.fn().mockImplementation((ag: Agendamento) => Promise.resolve(ag)),
    } as any;

    const uc = new CriarAgendamento(agendamentoRepo, clienteRepo, barbeiroRepo, servicoRepo);
    return { uc, agendamentoRepo };
  };

  it('não permite agendar cliente bloqueado', async () => {
    const { uc } = buildUseCase({ cliente: { bloqueado: true } });

    await expect(
      uc.execute({
        clienteId: 'c1',
        barbeiroId: 'b1',
        servicoId: 's1',
        dataHoraInicio: makeDate('2024-01-01T12:00:00Z'),
        origem: 'cliente',
      }),
    ).rejects.toThrow(DomainError);
  });

  it('não permite agendar com conflito de horário', async () => {
    const conflito = new Agendamento({
      barbeiroId: 'b1',
      clienteId: 'c2',
      servicoId: 's1',
      dataHoraInicio: makeDate('2024-01-01T12:00:00Z'),
      dataHoraFim: makeDate('2024-01-01T13:00:00Z'),
      status: 'CONFIRMADO',
      origem: 'cliente',
    });
    const { uc } = buildUseCase({ conflitos: [conflito] });

    await expect(
      uc.execute({
        clienteId: 'c1',
        barbeiroId: 'b1',
        servicoId: 's1',
        dataHoraInicio: makeDate('2024-01-01T12:00:00Z'),
        origem: 'cliente',
      }),
    ).rejects.toThrow(DomainError);
  });

  it('não permite agendar se violar antecedência mínima', async () => {
    jest.useFakeTimers().setSystemTime(makeDate('2024-01-01T11:30:00Z'));
    const { uc } = buildUseCase();

    await expect(
      uc.execute({
        clienteId: 'c1',
        barbeiroId: 'b1',
        servicoId: 's1',
        dataHoraInicio: makeDate('2024-01-01T12:00:00Z'),
        origem: 'cliente',
      }),
    ).rejects.toThrow(DomainError);

    jest.useRealTimers();
  });

  it('cria agendamento confirmado quando válido', async () => {
    jest.useFakeTimers().setSystemTime(makeDate('2024-01-01T10:00:00Z'));
    const { uc, agendamentoRepo } = buildUseCase();

    const agendamento = await uc.execute({
      clienteId: 'c1',
      barbeiroId: 'b1',
      servicoId: 's1',
      dataHoraInicio: makeDate('2024-01-01T12:00:00Z'),
      origem: 'cliente',
    });

    expect(agendamento.status).toBe('CONFIRMADO');
    expect(agendamentoRepo.create).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
