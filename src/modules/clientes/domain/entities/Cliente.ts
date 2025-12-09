import { randomUUID } from 'crypto';

export interface ClienteProps {
  id?: string;
  nome: string;
  telefone: string;
  faltas?: number;
  bloqueado?: boolean;
}

export class Cliente {
  public readonly id: string;

  public nome: string;

  public telefone: string;

  public faltas: number;

  public bloqueado: boolean;

  constructor(props: ClienteProps) {
    this.id = props.id ?? randomUUID();
    this.nome = props.nome;
    this.telefone = props.telefone;
    this.faltas = props.faltas ?? 0;
    this.bloqueado = props.bloqueado ?? false;
  }

  incrementFaltas(): void {
    this.faltas += 1;
  }

  block(): void {
    this.bloqueado = true;
  }

  unblock(): void {
    this.bloqueado = false;
  }

  updateNome(nome: string): void {
    this.nome = nome;
  }

  updateTelefone(telefone: string): void {
    this.telefone = telefone;
  }
}
