import { DomainError } from '@/shared/types/DomainError';
import { IHorarioTrabalhoRepository } from '../contracts/IHorarioTrabalhoRepository';
import { HorarioTrabalho } from '../entities/HorarioTrabalho';

interface ConfigurarHorarioTrabalhoInput {
  barbeiroId: string;
  diaSemana: number;
  horaInicio: Date;
  horaFim: Date;
}

export class ConfigurarHorarioTrabalho {
  constructor(private readonly horarioRepository: IHorarioTrabalhoRepository) {}

  async execute(input: ConfigurarHorarioTrabalhoInput): Promise<HorarioTrabalho> {
    const { barbeiroId, diaSemana, horaInicio, horaFim } = input;

    if (horaInicio >= horaFim) {
      throw new DomainError('Hora de início deve ser menor que a hora de fim', 'INVALID_TIME_RANGE');
    }

    const existentes = await this.horarioRepository.listByBarbeiroAndDia(barbeiroId, diaSemana);
    const existente = existentes[0];

    if (existente) {
      existente.atualizarIntervalo(horaInicio, horaFim);
      return this.horarioRepository.update(existente);
    }

    const novo = new HorarioTrabalho({
      barbeiroId,
      diaSemana,
      horaInicio,
      horaFim,
    });

    return this.horarioRepository.create(novo);
  }
}
