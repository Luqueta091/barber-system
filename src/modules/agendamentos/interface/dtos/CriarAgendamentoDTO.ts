export interface CriarAgendamentoDTO {
  clienteId: string;
  barbeiroId: string;
  servicoId: string;
  dataHoraInicio: string;
  origem: 'cliente' | 'barbeiro';
  observacoes?: string;
}
