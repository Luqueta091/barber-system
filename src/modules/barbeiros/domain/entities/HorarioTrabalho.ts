import { randomUUID } from 'crypto';

export interface HorarioTrabalhoProps {
  id?: string;
  barbeiroId: string;
  diaSemana: number;
  horaInicio: Date;
  horaFim: Date;
}

export class HorarioTrabalho {
  public readonly id: string;
  public barbeiroId: string;
  public diaSemana: number;
  public horaInicio: Date;
  public horaFim: Date;

  constructor(props: HorarioTrabalhoProps) {
    this.id = props.id ?? randomUUID();
    this.barbeiroId = props.barbeiroId;
    this.diaSemana = props.diaSemana;
    this.horaInicio = props.horaInicio;
    this.horaFim = props.horaFim;
  }

  atualizarIntervalo(horaInicio: Date, horaFim: Date): void {
    this.horaInicio = horaInicio;
    this.horaFim = horaFim;
  }
}
