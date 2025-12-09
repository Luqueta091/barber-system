import { randomUUID } from 'crypto';
import { DomainError } from '@/shared/types/DomainError';

export type AgendamentoStatus =
  | 'CONFIRMADO'
  | 'CONCLUIDO'
  | 'CANCELADO_CLIENTE'
  | 'CANCELADO_BARBEIRO'
  | 'FALTA';

export interface AgendamentoProps {
  id?: string;
  barbeiroId: string;
  clienteId: string;
  servicoId: string;
  dataHoraInicio: Date;
  dataHoraFim: Date;
  status?: AgendamentoStatus;
  origem: string;
  observacoes?: string;
}

export class Agendamento {
  public readonly id: string;
  public barbeiroId: string;
  public clienteId: string;
  public servicoId: string;
  public dataHoraInicio: Date;
  public dataHoraFim: Date;
  public status: AgendamentoStatus;
  public origem: string;
  public observacoes?: string;

  constructor(props: AgendamentoProps) {
    this.id = props.id ?? randomUUID();
    this.barbeiroId = props.barbeiroId;
    this.clienteId = props.clienteId;
    this.servicoId = props.servicoId;
    this.dataHoraInicio = props.dataHoraInicio;
    this.dataHoraFim = props.dataHoraFim;
    this.status = props.status ?? 'CONFIRMADO';
    this.origem = props.origem;
    this.observacoes = props.observacoes;
  }

  private ensureConfirmado(): void {
    if (this.status !== 'CONFIRMADO') {
      throw new DomainError('Transição não permitida para o status atual', 'INVALID_STATUS');
    }
  }

  markConcluido(): void {
    this.ensureConfirmado();
    this.status = 'CONCLUIDO';
  }

  cancelByCliente(): void {
    this.ensureConfirmado();
    this.status = 'CANCELADO_CLIENTE';
  }

  cancelByBarbeiro(): void {
    this.ensureConfirmado();
    this.status = 'CANCELADO_BARBEIRO';
  }

  markFalta(): void {
    this.ensureConfirmado();
    this.status = 'FALTA';
  }
}
