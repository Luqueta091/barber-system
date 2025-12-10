import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import { getErrorMessage } from '../utils/errorMessage';
import { formatTime } from '../utils/time';

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

interface Servico {
  id: string;
  nome: string;
  duracaoMinutos?: number;
}

interface Slot {
  inicio: string;
  fim: string;
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
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [servicoId, setServicoId] = useState<string>('');
  const [slotsLivres, setSlotsLivres] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
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

  useEffect(() => {
    const loadServicos = async () => {
      try {
        const res = await api.get<Servico[]>('/servicos');
        setServicos(res.data);
        if (res.data.length > 0) {
          setServicoId(res.data[0].id);
        }
      } catch (err) {
        // não bloqueia a agenda, apenas não carrega slots livres
      }
    };
    loadServicos();
  }, []);

  const loadSlotsLivres = async () => {
    if (!barbeiroId || !servicoId || !data) {
      setSlotsLivres([]);
      return;
    }
    setLoadingSlots(true);
    try {
      const res = await api.get<Slot[]>('/disponibilidade', {
        params: {
          barbeiroId,
          servicoId,
          data: `${data}T00:00:00Z`,
        },
      });
      setSlotsLivres(res.data);
    } catch (err) {
      setSlotsLivres([]);
      setError(getErrorMessage(err, 'Erro ao carregar horários livres'));
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    loadSlotsLivres();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barbeiroId, servicoId, data]);

  const act = async (id: string, action: 'concluir' | 'falta' | 'cancelar' | 'apagar') => {
    if (!barbeiroId) return;
    const body = { barbeiroId };
    try {
      if (action === 'concluir') {
        await api.post(`/agendamentos/${id}/concluir`, body);
      } else if (action === 'falta') {
        await api.post(`/agendamentos/${id}/falta`, body);
      } else if (action === 'cancelar') {
        await api.delete(`/agendamentos/${id}/barbeiro`, { data: body });
      } else if (action === 'apagar') {
        await api.delete(`/agendamentos/${id}/apagar`, { data: body });
      }
      if (action === 'cancelar' || action === 'apagar') {
        setAgenda((prev) => prev.filter((ag) => ag.id !== id));
        setTimeout(() => {
          void loadAgenda();
        }, 1000);
      } else {
        await loadAgenda();
      }
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex w-full flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full max-w-xs"
            />
            <Button variant="secondary" size="sm" onClick={loadAgenda} disabled={loading}>
              {loading ? 'Atualizando...' : 'Atualizar'}
            </Button>
          </div>
          {servicos.length > 0 && (
            <div className="flex w-full flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <select
                value={servicoId}
                onChange={(e) => setServicoId(e.target.value)}
                className="w-full max-w-xs rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              >
                {servicos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </select>
              <Button size="sm" variant="secondary" onClick={loadSlotsLivres} disabled={loadingSlots}>
                {loadingSlots ? 'Buscando...' : 'Ver horários livres'}
              </Button>
            </div>
          )}
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
      {servicos.length > 0 && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Horários livres</p>
          {loadingSlots && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <Spinner size="sm" /> Carregando horários livres...
            </div>
          )}
          {!loadingSlots && slotsLivres.length === 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Nenhum horário livre para este dia/serviço.
            </p>
          )}
          {!loadingSlots && slotsLivres.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {slotsLivres.map((slot) => (
                <span
                  key={slot.inicio}
                  className="rounded-lg border border-primary-100 bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700"
                >
                  {formatTime(slot.inicio)}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="mt-4 grid gap-3">
        {agenda.map((ag) => {
          const inicio = formatTime(ag.dataHoraInicio);
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
                {ag.status === 'CANCELADO_CLIENTE' || ag.status === 'CANCELADO_BARBEIRO' ? (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => act(ag.id, 'apagar' as any)}
                  >
                    Apagar
                  </Button>
                ) : (
                  <Button size="sm" variant="danger" onClick={() => act(ag.id, 'cancelar')}>
                    Cancelar
                  </Button>
                )}
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
