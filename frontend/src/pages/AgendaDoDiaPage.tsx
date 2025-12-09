import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import { getErrorMessage } from '../utils/errorMessage';

interface Agendamento {
  id: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  clienteId: string;
  servicoId: string;
  status: string;
  clienteNome?: string;
  clienteTelefone?: string;
  servicoNome?: string;
  servicoDuracaoMinutos?: number;
}

interface Props {
  barbeiroId: string;
}

const statusVariant = (status: string) => {
  switch (status) {
    case 'CONFIRMADO':
      return 'default';
    case 'CONCLUIDO':
      return 'success';
    case 'FALTA':
      return 'warning';
    case 'CANCELADO_CLIENTE':
    case 'CANCELADO_BARBEIRO':
      return 'danger';
    default:
      return 'neutral';
  }
};

const AgendaDoDiaPage = ({ barbeiroId }: Props) => {
  const [data, setData] = useState<string>(new Date().toISOString().slice(0, 10));
  const [agenda, setAgenda] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadAgenda = async () => {
    if (!barbeiroId) return;
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const res = await api.get<Agendamento[]>(`/barbeiros/${barbeiroId}/agenda`, {
        params: { data },
      });
      setAgenda(res.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao carregar agenda'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgenda();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barbeiroId, data]);

  const act = async (id: string, action: 'concluir' | 'falta' | 'cancelar') => {
    if (!barbeiroId) return;
    const body = { barbeiroId };
    try {
      if (action === 'concluir') {
        await api.post(`/agendamentos/${id}/concluir`, body);
      } else if (action === 'falta') {
        await api.post(`/agendamentos/${id}/falta`, body);
      } else {
        await api.delete(`/agendamentos/${id}/barbeiro`, { data: body });
      }
      await loadAgenda();
      setFeedback('Atualizado com sucesso.');
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao atualizar agendamento'));
    }
  };

  return (
    <Card
      title="Agenda do dia"
      subtitle="Veja e atualize os agendamentos do barbeiro selecionado."
      actions={
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="max-w-xs"
          />
          <Button variant="secondary" size="sm" onClick={loadAgenda} disabled={loading}>
            {loading ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </div>
      }
    >
      {feedback && <p className="mb-2 text-sm text-green-700">{feedback}</p>}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Spinner size="sm" /> Carregando agenda...
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="mt-4 grid gap-3">
        {agenda.map((ag) => {
          const inicio = new Date(ag.dataHoraInicio).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          return (
            <div
              key={ag.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{inicio}</p>
                  <p className="text-sm text-gray-600">
                    Cliente: {ag.clienteNome ?? ag.clienteId}{' '}
                    {ag.clienteTelefone ? `(${ag.clienteTelefone})` : ''}
                  </p>
                  <p className="text-sm text-gray-600">
                    Serviço: {ag.servicoNome ?? ag.servicoId}{' '}
                    {ag.servicoDuracaoMinutos ? `(${ag.servicoDuracaoMinutos} min)` : ''}
                  </p>
                </div>
                <Badge variant={statusVariant(ag.status)}>{ag.status}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => act(ag.id, 'concluir')}>
                  Concluir
                </Button>
                <Button size="sm" variant="secondary" onClick={() => act(ag.id, 'falta')}>
                  Falta
                </Button>
                <Button size="sm" variant="danger" onClick={() => act(ag.id, 'cancelar')}>
                  Cancelar
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {!loading && !error && agenda.length === 0 && (
        <p className="text-sm text-gray-600">Nenhum agendamento para esta data.</p>
      )}
    </Card>
  );
};

export default AgendaDoDiaPage;
