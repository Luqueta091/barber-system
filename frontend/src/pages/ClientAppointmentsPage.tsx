import { useEffect, useMemo, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import { api } from '../services/api';
import { getErrorMessage } from '../utils/errorMessage';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatTime } from '../utils/time';

type Tab = 'futuros' | 'passados';

interface Agendamento {
  id: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  barbeiroId: string;
  servicoId: string;
  status: string;
  origem: string;
  observacoes?: string | null;
}

const statusVariant = (status: string) => {
  switch (status) {
    case 'CONCLUIDO':
      return 'success';
    case 'CONFIRMADO':
      return 'default';
    case 'FALTA':
      return 'warning';
    case 'CANCELADO_CLIENTE':
    case 'CANCELADO_BARBEIRO':
      return 'danger';
    default:
      return 'neutral';
  }
};

const ClientAppointmentsPage = () => {
  const { user } = useAuth();
  const clienteId = user.cliente?.id;

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [barbeiros, setBarbeiros] = useState<Record<string, string>>({});
  const [servicos, setServicos] = useState<Record<string, { nome: string; duracao?: number }>>({});
  const [tab, setTab] = useState<Tab>('futuros');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const load = async () => {
    if (!clienteId) {
      setError('Faça login para ver seus agendamentos.');
      return;
    }
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const [agRes, barbRes, servRes] = await Promise.all([
        api.get<Agendamento[]>(`/clientes/${clienteId}/agendamentos`),
        api.get<{ id: string; nome: string }[]>('/barbeiros'),
        api.get<{ id: string; nome: string; duracaoMinutos?: number }[]>('/servicos'),
      ]);
      setAgendamentos(agRes.data);
      setBarbeiros(
        barbRes.data.reduce<Record<string, string>>((acc, b) => {
          acc[b.id] = b.nome;
          return acc;
        }, {}),
      );
      setServicos(
        servRes.data.reduce<Record<string, { nome: string; duracao?: number }>>((acc, s) => {
          acc[s.id] = { nome: s.nome, duracao: s.duracaoMinutos };
          return acc;
        }, {}),
      );
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao carregar seus agendamentos'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteId]);

  const filtered = useMemo(() => {
    const now = new Date();
    return agendamentos
      .filter((ag) => ag.status === 'CONFIRMADO')
      .filter((ag) => {
        const inicio = new Date(ag.dataHoraInicio);
        return tab === 'futuros' ? inicio >= now : inicio < now;
      });
  }, [agendamentos, tab]);

  const cancelar = async (id: string) => {
    if (!clienteId) return;
    const confirm = window.confirm('Deseja cancelar este agendamento?');
    if (!confirm) return;
    try {
      await api.delete(`/agendamentos/${id}`, { data: { clienteId } });
      setFeedback('Agendamento cancelado com sucesso.');
      load();
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao cancelar agendamento'));
    }
  };

  const isCancelable = (ag: Agendamento) => {
    const inicio = new Date(ag.dataHoraInicio);
    return ag.status === 'CONFIRMADO' && inicio.getTime() > Date.now();
  };

  if (!clienteId) {
    return (
      <Card
        title="Login necessário"
        subtitle="Acesse sua conta para ver e cancelar seus agendamentos."
      >
        <p className="text-sm text-gray-600">
          Faça login e retorne a esta página para acompanhar seus horários.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Meus agendamentos</h2>
        <p className="text-gray-600">Veja e cancele seus horários confirmados.</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={tab === 'futuros' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setTab('futuros')}
        >
          Próximos
        </Button>
        <Button
          variant={tab === 'passados' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setTab('passados')}
        >
          Passados
        </Button>
      </div>

      <Card>
        {feedback && <p className="mb-2 text-sm text-green-700">{feedback}</p>}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Spinner size="sm" /> Carregando...
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-600">
            Você não tem agendamentos nesta lista.
          </div>
        )}

        <div className="mt-3 grid gap-3">
          {filtered.map((ag) => {
            const inicio = new Date(ag.dataHoraInicio);
            const fim = new Date(ag.dataHoraFim);
            const dataLabel = formatDate(ag.dataHoraInicio);
            const horaInicio = formatTime(ag.dataHoraInicio);
            const horaFim = formatTime(ag.dataHoraFim);
            const barbeiroNome = barbeiros[ag.barbeiroId] ?? ag.barbeiroId;
            const servicoInfo = servicos[ag.servicoId];
            const servicoNome = servicoInfo?.nome ?? ag.servicoId;
            const servicoDuracao = servicoInfo?.duracao;

            return (
              <div
                key={ag.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {dataLabel} — {horaInicio} às {horaFim}
                    </p>
                    <p className="text-sm text-gray-600">Barbeiro: {barbeiroNome}</p>
                    <p className="text-sm text-gray-600">
                      Serviço: {servicoNome} {servicoDuracao ? `(${servicoDuracao} min)` : ''}
                    </p>
                  </div>
                  <Badge variant={statusVariant(ag.status)}>{ag.status}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {isCancelable(ag) ? (
                    <Button size="sm" variant="danger" onClick={() => cancelar(ag.id)}>
                      Cancelar
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" disabled>
                      Não é possível cancelar
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default ClientAppointmentsPage;
