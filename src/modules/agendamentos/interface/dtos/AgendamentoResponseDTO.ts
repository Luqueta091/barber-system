import { AgendamentoStatus } from '../../domain/entities/Agendamento';

export interface AgendamentoResponseDTO {
  id: string;
  barbeiroId: string;
  clienteId: string;
  servicoId: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: AgendamentoStatus;
  origem: string;
  observacoes?: string;
}
