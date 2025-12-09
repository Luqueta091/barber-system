import { addMinutes } from '@/shared/utils/dateUtils';
import { Agendamento } from '../entities/Agendamento';
import { HorarioTrabalho } from '@/modules/barbeiros/domain/entities/HorarioTrabalho';

interface CalculateSlotsParams {
  horariosTrabalho: HorarioTrabalho[];
  duracaoMinutos: number;
  agendamentosExistentes: Agendamento[];
  data: Date;
  minLeadTimeMinutes: number;
}

const alignDateTime = (data: Date, referencia: Date): Date => {
  const aligned = new Date(data);
  aligned.setHours(referencia.getHours(), referencia.getMinutes(), 0, 0);
  return aligned;
};

const hasOverlap = (startA: Date, endA: Date, startB: Date, endB: Date): boolean => {
  return startA < endB && endA > startB;
};

export const calculateSlots = ({
  horariosTrabalho,
  duracaoMinutos,
  agendamentosExistentes,
  data,
  minLeadTimeMinutes,
}: CalculateSlotsParams): { inicio: Date; fim: Date }[] => {
  const now = new Date();
  const leadTimeLimit = addMinutes(now, minLeadTimeMinutes);
  const confirmed = agendamentosExistentes.filter((a) => a.status === 'CONFIRMADO');

  const slots: { inicio: Date; fim: Date }[] = [];

  horariosTrabalho.forEach((horario) => {
    const inicioJanela = alignDateTime(data, horario.horaInicio);
    const fimJanela = alignDateTime(data, horario.horaFim);

    let cursor = new Date(inicioJanela);

    while (true) {
      const fimSlot = addMinutes(cursor, duracaoMinutos);
      if (fimSlot > fimJanela) break;

      if (cursor < leadTimeLimit) {
        cursor = addMinutes(cursor, duracaoMinutos);
        continue;
      }

      const overlaps = confirmed.some((ag) =>
        hasOverlap(cursor, fimSlot, ag.dataHoraInicio, ag.dataHoraFim),
      );

      if (!overlaps) {
        slots.push({ inicio: new Date(cursor), fim: fimSlot });
      }

      cursor = addMinutes(cursor, duracaoMinutos);
    }
  });

  return slots.sort((a, b) => a.inicio.getTime() - b.inicio.getTime());
};
