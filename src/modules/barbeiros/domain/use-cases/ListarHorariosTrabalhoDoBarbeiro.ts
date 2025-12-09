import { IHorarioTrabalhoRepository } from '../contracts/IHorarioTrabalhoRepository';
import { HorarioTrabalho } from '../entities/HorarioTrabalho';

interface ListarHorariosTrabalhoInput {
  barbeiroId: string;
  diaSemana?: number;
}

export class ListarHorariosTrabalhoDoBarbeiro {
  constructor(private readonly horarioRepository: IHorarioTrabalhoRepository) {}

  async execute(input: ListarHorariosTrabalhoInput): Promise<HorarioTrabalho[]> {
    const { barbeiroId, diaSemana } = input;

    if (diaSemana !== undefined) {
      return this.horarioRepository.listByBarbeiroAndDia(barbeiroId, diaSemana);
    }

    return this.horarioRepository.listByBarbeiro(barbeiroId);
  }
}
