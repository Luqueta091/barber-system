import { randomUUID } from 'crypto';

export interface ServicoProps {
  id?: string;
  nome: string;
  duracaoMinutos: number;
  preco: number;
  ativo?: boolean;
}

export class Servico {
  public readonly id: string;
  public nome: string;
  public duracaoMinutos: number;
  public preco: number;
  public ativo: boolean;

  constructor(props: ServicoProps) {
    this.id = props.id ?? randomUUID();
    this.nome = props.nome;
    this.duracaoMinutos = props.duracaoMinutos;
    this.preco = props.preco;
    this.ativo = props.ativo ?? true;
  }

  atualizarDados(dados: Partial<Omit<ServicoProps, 'id'>>): void {
    if (dados.nome !== undefined) this.nome = dados.nome;
    if (dados.duracaoMinutos !== undefined) this.duracaoMinutos = dados.duracaoMinutos;
    if (dados.preco !== undefined) this.preco = dados.preco;
    if (dados.ativo !== undefined) this.ativo = dados.ativo;
  }

  ativar(): void {
    this.ativo = true;
  }

  inativar(): void {
    this.ativo = false;
  }
}
