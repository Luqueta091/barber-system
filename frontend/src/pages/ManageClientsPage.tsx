import { useMemo, useState } from 'react';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { getErrorMessage } from '../utils/errorMessage';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { formatDate, formatTime } from '../utils/time';

interface Agendamento {
  id: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: string;
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

const ManageClientsPage = () => {
  const [clienteId, setClienteId] = useState('');
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!clienteId) {
      setError('Informe o ID do cliente');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Agendamento[]>(`/clientes/${clienteId}/agendamentos`);
      setAgendamentos(res.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao carregar agendamentos do cliente'));
    } finally {
      setLoading(false);
    }
  };

  const confirmados = useMemo(
    () =>
      agendamentos
        .filter((a) => a.status === 'CONFIRMADO')
        .sort(
          (a, b) =>
            new Date(b.dataHoraInicio).getTime() - new Date(a.dataHoraInicio).getTime(),
        )
        .slice(0, 5),
    [agendamentos],
  );

  const teveFalta = useMemo(
    () => agendamentos.some((a) => a.status === 'FALTA'),
    [agendamentos],
  );

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Clientes</h2>
        <p className="text-gray-600">
          Consulte rapidamente os últimos agendamentos confirmados e se houve faltas.
        </p>
      </div>

      <Card title="Buscar cliente" subtitle="Informe o ID do cliente para visualizar">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-end">
          <Input
            label="ID do cliente"
            placeholder="Cole o ID do cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
          />
          <Button type="button" onClick={load} disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </Card>

      <Card title="Resumo" subtitle="Faltas e últimos confirmados">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Spinner size="sm" /> Carregando...
          </div>
        )}
        {!loading && !clienteId && (
          <p className="text-sm text-gray-600">Informe um cliente para visualizar.</p>
        )}
        {!loading && clienteId && agendamentos.length === 0 && !error && (
          <p className="text-sm text-gray-600">Nenhum agendamento encontrado para este cliente.</p>
        )}

        {!loading && agendamentos.length > 0 && (
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">Faltas:</span>
              <Badge variant={teveFalta ? 'danger' : 'success'}>
                {teveFalta ? 'Sim, há faltas' : 'Sem faltas registradas'}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">Últimos confirmados</p>
              <div className="mt-2 grid gap-2">
                {confirmados.map((ag) => {
                  const inicio = new Date(ag.dataHoraInicio);
                  const fim = new Date(ag.dataHoraFim);
                  return (
                    <div
                      key={ag.id}
                      className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm text-gray-800">
                          {formatDate(ag.dataHoraInicio)} — {formatTime(ag.dataHoraInicio)} às{' '}
                          {formatTime(ag.dataHoraFim)}
                        </div>
                        <Badge variant={statusVariant(ag.status)}>{ag.status}</Badge>
                      </div>
                    </div>
                  );
                })}
                {confirmados.length === 0 && (
                  <p className="text-sm text-gray-600">Nenhum confirmado recente.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ManageClientsPage;
