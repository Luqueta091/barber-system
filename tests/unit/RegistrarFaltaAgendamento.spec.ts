import { RegistrarFaltaAgendamento } from '@/modules/agendamentos/domain/use-cases/RegistrarFaltaAgendamento';
import { Agendamento } from '@/modules/agendamentos/domain/entities/Agendamento';
import { RegistrarFaltaCliente } from '@/modules/clientes/domain/use-cases/RegistrarFaltaCliente';

describe('RegistrarFaltaAgendamento', () => {
  const buildUseCase = () => {
    const agendamentoBase = new Agendamento({
      id: 'a1',
      barbeiroId: 'b1',
      clienteId: 'c1',
      servicoId: 's1',
      dataHoraInicio: new Date(),
      dataHoraFim: new Date(),
      status: 'CONFIRMADO',
      origem: 'cliente',
    });

    const agendamentoRepository = {
      findById: jest.fn().mockResolvedValue(agendamentoBase),
      update: jest.fn().mockImplementation((a: Agendamento) => Promise.resolve(a)),
    } as any;

    const registrarFaltaCliente = {
      execute: jest.fn().mockResolvedValue({}),
    } as unknown as RegistrarFaltaCliente;

    const uc = new RegistrarFaltaAgendamento(agendamentoRepository, registrarFaltaCliente);

    return { uc, agendamentoRepository, registrarFaltaCliente, agendamentoBase };
  };

  it('marca falta e incrementa faltas do cliente', async () => {
    const { uc, agendamentoRepository, registrarFaltaCliente } = buildUseCase();

    const result = await uc.execute({ agendamentoId: 'a1', barbeiroId: 'b1', limitFaltas: 3 });

    expect(result.status).toBe('FALTA');
    expect(agendamentoRepository.update).toHaveBeenCalled();
    expect(registrarFaltaCliente.execute).toHaveBeenCalledWith({
      clienteId: 'c1',
      limitFaltas: 3,
    });
  });
});
