import { calculateSlots } from '@/modules/agendamentos/domain/rules/CalculadorDeSlots';
import { HorarioTrabalho } from '@/modules/barbeiros/domain/entities/HorarioTrabalho';
import { Agendamento } from '@/modules/agendamentos/domain/entities/Agendamento';

describe('CalculadorDeSlots', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  const criarHorario = (diaSemana: number, inicio: string, fim: string): HorarioTrabalho => {
    return new HorarioTrabalho({
      barbeiroId: 'b1',
      diaSemana,
      horaInicio: new Date(inicio),
      horaFim: new Date(fim),
    });
  };

  const criarAgendamento = (inicio: string, fim: string): Agendamento => {
    return new Agendamento({
      id: 'a1',
      barbeiroId: 'b1',
      clienteId: 'c1',
      servicoId: 's1',
      dataHoraInicio: new Date(inicio),
      dataHoraFim: new Date(fim),
      status: 'CONFIRMADO',
      origem: 'cliente',
    });
  };

  it('gera slots dentro do horário de trabalho', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T08:00:00Z'));
    const data = new Date('2024-01-01T00:00:00Z');
    const horarios = [criarHorario(2, '2024-01-01T09:00:00Z', '2024-01-01T10:00:00Z')];

    const slots = calculateSlots({
      horariosTrabalho: horarios,
      duracaoMinutos: 30,
      agendamentosExistentes: [],
      data,
      minLeadTimeMinutes: 0,
    });

    expect(slots).toHaveLength(2);
    expect(slots[0].inicio.toISOString()).toBe('2024-01-01T09:00:00.000Z');
    expect(slots[1].inicio.toISOString()).toBe('2024-01-01T09:30:00.000Z');
  });

  it('remove slots que conflitam com agendamentos existentes', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T08:00:00Z'));
    const data = new Date('2024-01-01T00:00:00Z');
    const horarios = [criarHorario(2, '2024-01-01T09:00:00Z', '2024-01-01T10:00:00Z')];
    const agendamentos = [
      criarAgendamento('2024-01-01T09:00:00Z', '2024-01-01T09:30:00Z'),
    ];

    const slots = calculateSlots({
      horariosTrabalho: horarios,
      duracaoMinutos: 30,
      agendamentosExistentes: agendamentos,
      data,
      minLeadTimeMinutes: 0,
    });

    expect(slots).toHaveLength(1);
    expect(slots[0].inicio.toISOString()).toBe('2024-01-01T09:30:00.000Z');
  });

  it('exclui slots no passado ou que violam antecedência mínima', () => {
    const now = new Date('2024-01-01T08:30:00Z');
    jest.useFakeTimers().setSystemTime(now);

    const data = new Date('2024-01-01T00:00:00Z');
    const horarios = [criarHorario(1, '2024-01-01T09:00:00Z', '2024-01-01T10:00:00Z')];

    const slots = calculateSlots({
      horariosTrabalho: horarios,
      duracaoMinutos: 30,
      agendamentosExistentes: [],
      data,
      minLeadTimeMinutes: 60,
    });

    expect(slots).toHaveLength(1);
    expect(slots[0].inicio.toISOString()).toBe('2024-01-01T09:30:00.000Z');
  });
});
