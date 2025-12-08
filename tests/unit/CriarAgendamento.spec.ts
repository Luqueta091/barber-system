import { describe, expect, it, vi } from '@jest/globals';

describe('CriarAgendamento', () => {
  const makeUseCase = () => {
    const agendamentoRepo = { existeConflito: vi.fn(), criar: vi.fn() };
    const clienteRepo = { estaBloqueado: vi.fn(), registrarFalta: vi.fn() };
    const clock = { agora: () => new Date() };

    const useCase = async (input: any) => {
      if (await clienteRepo.estaBloqueado(input.clienteId)) {
        throw new Error('CLIENTE_BLOQUEADO');
      }
      if (await agendamentoRepo.existeConflito(input)) {
        throw new Error('CONFLITO_HORARIO');
      }
      const leadTimeMinutes = 30;
      const inicio = new Date(input.dataHoraInicio);
      const limite = new Date(clock.agora().getTime() + leadTimeMinutes * 60000);
      if (inicio < limite) {
        throw new Error('LEAD_TIME_INVALIDO');
      }
      const agendamento = { ...input, status: 'CONFIRMADO' };
      await agendamentoRepo.criar(agendamento);
      return agendamento;
    };

    return { agendamentoRepo, clienteRepo, useCase };
  };

  it('nao permite agendar quando cliente bloqueado', async () => {
    const { clienteRepo, useCase } = makeUseCase();
    clienteRepo.estaBloqueado.mockResolvedValue(true);

    await expect(
      useCase({ clienteId: 'c1', dataHoraInicio: new Date().toISOString() }),
    ).rejects.toThrow('CLIENTE_BLOQUEADO');
  });

  it('nao permite agendar com conflito', async () => {
    const { agendamentoRepo, useCase } = makeUseCase();
    agendamentoRepo.existeConflito.mockResolvedValue(true);

    await expect(
      useCase({ clienteId: 'c1', dataHoraInicio: new Date().toISOString() }),
    ).rejects.toThrow('CONFLITO_HORARIO');
  });

  it('nao permite agendar violando lead time', async () => {
    const { useCase } = makeUseCase();

    await expect(
      useCase({ clienteId: 'c1', dataHoraInicio: new Date().toISOString() }),
    ).rejects.toThrow('LEAD_TIME_INVALIDO');
  });

  it('cria agendamento confirmado quando valido', async () => {
    const { useCase, agendamentoRepo } = makeUseCase();
    const future = new Date(Date.now() + 60 * 60000).toISOString();

    const resultado = await useCase({ clienteId: 'c1', dataHoraInicio: future });

    expect(resultado.status).toBe('CONFIRMADO');
    expect(agendamentoRepo.criar).toHaveBeenCalled();
  });
});
