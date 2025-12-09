import { FormEvent, useEffect, useState } from 'react';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { getErrorMessage } from '../utils/errorMessage';

interface Service {
  id: string;
  nome: string;
  duracaoMinutos: number;
  preco: number;
  ativo: boolean;
}

const ManageServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<Partial<Service>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Service[]>('/servicos');
      setServices(res.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao carregar serviços'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.duracaoMinutos || form.preco === undefined) return;
    setSaving(true);
    setError(null);
    setFeedback(null);
    try {
      if (editingId) {
        await api.put(`/servicos/${editingId}`, {
          nome: form.nome,
          duracaoMinutos: form.duracaoMinutos,
          preco: form.preco,
        });
        setFeedback('Serviço atualizado.');
      } else {
        await api.post('/servicos', {
          nome: form.nome,
          duracaoMinutos: form.duracaoMinutos,
          preco: form.preco,
        });
        setFeedback('Serviço criado.');
      }
      setForm({});
      setEditingId(null);
      load();
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao salvar serviço'));
    } finally {
      setSaving(false);
    }
  };

  const toggleAtivo = async (id: string, ativo: boolean) => {
    setError(null);
    setFeedback(null);
    try {
      await api.patch(`/servicos/${id}/status`, { ativo });
      setFeedback('Status atualizado.');
      load();
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao atualizar status'));
    }
  };

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Serviços</h2>
        <p className="text-gray-600">
          Cadastre e atualize os serviços oferecidos (nome, duração, preço e status).
        </p>
      </div>

      <Card title={editingId ? 'Editar serviço' : 'Novo serviço'}>
        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-3">
          <Input
            label="Nome"
            placeholder="Corte, Barba..."
            value={form.nome || ''}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            required
          />
          <Input
            label="Duração (min)"
            type="number"
            value={form.duracaoMinutos ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, duracaoMinutos: Number(e.target.value) || undefined }))
            }
            required
          />
          <Input
            label="Preço"
            type="number"
            value={form.preco ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, preco: Number(e.target.value) || undefined }))}
            required
          />
          <div className="sm:col-span-3 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {editingId ? 'Edite os campos e salve.' : 'Preencha para criar um novo serviço.'}
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : editingId ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {feedback && <p className="mt-2 text-sm text-green-700">{feedback}</p>}
      </Card>

      <Card title="Serviços cadastrados" subtitle="Clique para editar ou alterar o status.">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Spinner size="sm" /> Carregando serviços...
          </div>
        )}
        {!loading && services.length === 0 && (
          <p className="text-sm text-gray-600">Nenhum serviço cadastrado.</p>
        )}
        <div className="mt-3 grid gap-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-gray-900">{s.nome}</p>
                  <p className="text-sm text-gray-600">
                    {s.duracaoMinutos} min · R${s.preco}
                  </p>
                </div>
                <Badge variant={s.ativo ? 'success' : 'danger'}>
                  {s.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setEditingId(s.id);
                    setForm({
                      nome: s.nome,
                      duracaoMinutos: s.duracaoMinutos,
                      preco: s.preco,
                    });
                  }}
                >
                  Editar
                </Button>
                <Button size="sm" onClick={() => toggleAtivo(s.id, !s.ativo)}>
                  {s.ativo ? 'Inativar' : 'Ativar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ManageServicesPage;
