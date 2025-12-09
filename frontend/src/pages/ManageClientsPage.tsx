import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { getErrorMessage } from '../utils/errorMessage';

interface Client {
  id: string;
  nome: string;
  telefone: string;
  faltas: number;
  bloqueado: boolean;
}

const ManageClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const res = await api.get<Client[]>('/clientes'); // assumes endpoint lists clients
      setClients(res.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao carregar clientes'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const desbloquear = async (id: string) => {
    setError(null);
    setFeedback(null);
    try {
      await api.post(`/clientes/${id}/desbloquear`);
      setFeedback('Cliente desbloqueado.');
      load();
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao desbloquear cliente'));
    }
  };

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Clientes</h2>
        <p className="text-gray-600">Visualize faltas, bloqueio e desbloqueie quando necessário.</p>
      </div>

      <Card title="Lista de clientes" subtitle="Dados básicos e status de bloqueio.">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Spinner size="sm" /> Carregando clientes...
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {feedback && <p className="text-sm text-green-700">{feedback}</p>}
        {!loading && clients.length === 0 && (
          <p className="text-sm text-gray-600">Nenhum cliente cadastrado.</p>
        )}
        <div className="mt-3 grid gap-3">
          {clients.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-gray-900">{c.nome}</p>
                  <p className="text-sm text-gray-600">{c.telefone}</p>
                  <p className="text-xs text-gray-500">Faltas: {c.faltas}</p>
                </div>
                <Badge variant={c.bloqueado ? 'danger' : 'success'}>
                  {c.bloqueado ? 'Bloqueado' : 'Ativo'}
                </Badge>
              </div>
              {c.bloqueado && (
                <div className="mt-3">
                  <Button size="sm" onClick={() => desbloquear(c.id)}>
                    Desbloquear
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ManageClientsPage;
