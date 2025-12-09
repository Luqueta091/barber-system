import { FormEvent, useEffect, useState } from 'react';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { getErrorMessage } from '../utils/errorMessage';

interface Barber {
  id: string;
  nome: string;
  telefone: string;
  ativo: boolean;
}

interface Horario {
  diasSemana: number[];
  horaInicio: string;
  horaFim: string;
}

const dayLabel = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const toISOWithDate = (time: string) =>
  time ? `1970-01-01T${time.length === 5 ? `${time}:00` : time}` : '';

const ManageBarbersPage = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [form, setForm] = useState<Partial<Barber>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [horario, setHorario] = useState<Horario>({
    diasSemana: [],
    horaInicio: '',
    horaFim: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Barber[]>('/barbeiros');
      setBarbers(res.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao carregar barbeiros'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.telefone) return;
    setSaving(true);
    setError(null);
    setFeedback(null);
    try {
      if (editingId) {
        await api.put(`/barbeiros/${editingId}`, {
          nome: form.nome,
          telefone: form.telefone,
        });
        setFeedback('Barbeiro atualizado.');
      } else {
        await api.post('/barbeiros', {
          nome: form.nome,
          telefone: form.telefone,
        });
        setFeedback('Barbeiro criado.');
      }
      setForm({});
      setEditingId(null);
      load();
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao salvar barbeiro'));
    } finally {
      setSaving(false);
    }
  };

  const toggleAtivo = async (id: string, ativo: boolean) => {
    setError(null);
    setFeedback(null);
    try {
      await api.patch(`/barbeiros/${id}/status`, { ativo });
      setFeedback('Status atualizado.');
      load();
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao atualizar status'));
    }
  };

  const saveHorario = async (barbeiroId: string) => {
    if (!horario.horaInicio || !horario.horaFim || horario.diasSemana.length === 0) return;
    setError(null);
    setFeedback(null);
    try {
      await Promise.all(
        horario.diasSemana.map((diaSemana) =>
          api.post(`/barbeiros/${barbeiroId}/horarios`, {
            diaSemana,
            horaInicio: toISOWithDate(horario.horaInicio),
            horaFim: toISOWithDate(horario.horaFim),
          }),
        ),
      );
      setFeedback('Horário salvo para os dias selecionados.');
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao salvar horário'));
    }
  };

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Barbeiros</h2>
        <p className="text-gray-600">
          Cadastre profissionais, ative/inative e defina horários de trabalho.
        </p>
      </div>

      <Card title={editingId ? 'Editar barbeiro' : 'Novo barbeiro'}>
        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-3">
          <Input
            label="Nome"
            placeholder="Nome do barbeiro"
            value={form.nome || ''}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            required
          />
          <Input
            label="Telefone"
            placeholder="(XX) XXXXX-XXXX"
            value={form.telefone || ''}
            onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
            required
          />
          <div className="sm:col-span-3 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {editingId ? 'Altere os campos e salve.' : 'Preencha para cadastrar um barbeiro.'}
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : editingId ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Horário de trabalho" subtitle="Selecione um barbeiro e aplique o horário.">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <p className="text-sm font-medium text-gray-700 mb-2">Dias da semana</p>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map((d) => {
                const selected = horario.diasSemana.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                      selected
                        ? 'border-primary-400 bg-primary-50 text-primary-700'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                    onClick={() =>
                      setHorario((h) => ({
                        ...h,
                        diasSemana: selected
                          ? h.diasSemana.filter((day) => day !== d)
                          : [...h.diasSemana, d],
                      }))
                    }
                  >
                    {dayLabel[d]}
                  </button>
                );
              })}
            </div>
          </div>
          <Input
            label="Início"
            type="time"
            value={horario.horaInicio}
            onChange={(e) => setHorario((h) => ({ ...h, horaInicio: e.target.value }))}
          />
          <Input
            label="Fim"
            type="time"
            value={horario.horaFim}
            onChange={(e) => setHorario((h) => ({ ...h, horaFim: e.target.value }))}
          />
          <div className="flex items-end">
            <p className="text-sm text-gray-500">
              Escolha o barbeiro abaixo e clique em &quot;Salvar horário&quot;.
            </p>
          </div>
        </div>
      </Card>

      <Card title="Barbeiros cadastrados" subtitle="Edite dados, status e horários.">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Spinner size="sm" /> Carregando barbeiros...
          </div>
        )}
        {!loading && barbers.length === 0 && (
          <p className="text-sm text-gray-600">Nenhum barbeiro cadastrado.</p>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {feedback && <p className="text-sm text-green-700">{feedback}</p>}
        <div className="mt-3 grid gap-3">
          {barbers.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-gray-900">{b.nome}</p>
                  <p className="text-sm text-gray-600">{b.telefone}</p>
                </div>
                <Badge variant={b.ativo ? 'success' : 'danger'}>
                  {b.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setEditingId(b.id);
                    setForm({ nome: b.nome, telefone: b.telefone });
                  }}
                >
                  Editar
                </Button>
                <Button size="sm" onClick={() => toggleAtivo(b.id, !b.ativo)}>
                  {b.ativo ? 'Inativar' : 'Ativar'}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => saveHorario(b.id)}>
                  Salvar horário
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ManageBarbersPage;
