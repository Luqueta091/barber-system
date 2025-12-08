import { describe, expect, it, vi } from '@jest/globals';

describe('RegistrarFaltaAgendamento', () => {
  const makeUseCase = () => {
    const agendamentoRepo = {
      buscarPorId: vi.fn(),
      atualizarStatus: vi.fn(),
    };
    const clienteRepo = {
      incrementarFaltas: vi.fn(),
      bloquear: vi.fn(),
    };

    const useCase = async (id: string) => {
      const agendamento = await agendamentoRepo.buscarPorId(id);
      if (!agendamento) throw new Error('AGENDAMENTO_NAO_ENCONTRADO');

      await agendamentoRepo.atualizarStatus(id, 'FALTA');
      const faltas = await clienteRepo.incrementarFaltas(agendamento.clienteId);
      if (faltas >= 3) {
        await clienteRepo.bloquear(agendamento.clienteId);
      }
      return { ...agendamento, status: 'FALTA', faltas };
    };

    return { agendamentoRepo, clienteRepo, useCase };
  };

  it('altera status para FALTA', async () => {
    const { agendamentoRepo, useCase } = makeUseCase();
    agendamentoRepo.buscarPorId.mockResolvedValue({ id: 'a1', clienteId: 'c1', status: 'CONFIRMADO' });
    agendamentoRepo.atualizarStatus.mockResolvedValue(undefined);
    const result = await useCase('a1');
    expect(result.status).toBe('FALTA');
    expect(agendamentoRepo.atualizarStatus).toHaveBeenCalledWith('a1', 'FALTA');
  });

  it('incrementa contador de faltas', async () => {
    const { agendamentoRepo, clienteRepo, useCase } = makeUseCase();
    agendamentoRepo.buscarPorId.mockResolvedValue({ id: 'a1', clienteId: 'c1', status: 'CONFIRMADO' });
    clienteRepo.incrementarFaltas.mockResolvedValue(1);
    await useCase('a1');
    expect(clienteRepo.incrementarFaltas).toHaveBeenCalledWith('c1');
  });

  it('bloqueia cliente ao atingir limite', async () => {
    const { agendamentoRepo, clienteRepo, useCase } = makeUseCase();
    agendamentoRepo.buscarPorId.mockResolvedValue({ id: 'a1', clienteId: 'c1', status: 'CONFIRMADO' });
    clienteRepo.incrementarFaltas.mockResolvedValue(3);
    await useCase('a1');
    expect(clienteRepo.bloquear).toHaveBeenCalledWith('c1');
  });
});
