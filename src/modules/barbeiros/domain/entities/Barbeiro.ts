import { randomUUID } from 'crypto';

export interface BarbeiroProps {
  id?: string;
  nome: string;
  telefone: string;
  ativo?: boolean;
}

export class Barbeiro {
  public readonly id: string;
  public nome: string;
  public telefone: string;
  public ativo: boolean;

  constructor(props: BarbeiroProps) {
    this.id = props.id ?? randomUUID();
    this.nome = props.nome;
    this.telefone = props.telefone;
    this.ativo = props.ativo ?? true;
  }

  atualizarNome(nome: string): void {
    this.nome = nome;
  }

  atualizarTelefone(telefone: string): void {
    this.telefone = telefone;
  }

  ativar(): void {
    this.ativo = true;
  }

  desativar(): void {
    this.ativo = false;
  }
}
