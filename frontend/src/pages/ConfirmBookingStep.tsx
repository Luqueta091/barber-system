import { FormEvent, useState } from 'react';
import { api } from '../services/api';
import { Card } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { getErrorMessage } from '../utils/errorMessage';

interface Props {
  barbeiroId: string;
  servicoId: string;
  barbeiroNome?: string;
  servicoNome?: string;
  slot: { inicio: string; fim: string };
  onSuccess?: () => void;
}

const ConfirmBookingStep = ({
  barbeiroId,
  servicoId,
  barbeiroNome,
  servicoNome,
  slot,
  onSuccess,
}: Props) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const clienteRes = await api.post('/clientes', { nome, telefone });
      const clienteId = clienteRes.data.id;

      await api.post('/agendamentos', {
        clienteId,
        barbeiroId,
        servicoId,
        dataHoraInicio: slot.inicio,
        origem: 'cliente',
      });

      setMessage('Agendamento criado com sucesso!');
      onSuccess?.();
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao criar agendamento'));
    } finally {
      setLoading(false);
    }
  };

  const slotLabel = new Date(slot.inicio).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card
      title="5. Confirme seus dados"
      subtitle={`Horário selecionado: ${slotLabel}`}
      className="border-dashed border-primary-100 w-full max-w-2xl mx-auto"
    >
      {message && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 shadow-soft">
          {message}
        </div>
      )}
      <div className="mb-4 grid gap-3 rounded-2xl border border-gray-100 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-gray-600">
            Barbeiro: {barbeiroNome ?? barbeiroId}
          </div>
          <div className="text-sm text-gray-600">
            Serviço: {servicoNome ?? servicoId}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
          <span className="rounded-lg bg-primary-50 px-3 py-1 font-semibold text-primary-700">
            Início: {slotLabel}
          </span>
          <span className="rounded-lg bg-gray-100 px-3 py-1 text-gray-700">
            Fim: {new Date(slot.fim).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Nome"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <Input
          label="Telefone"
          placeholder="(XX) XXXXX-XXXX"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          required
        />
        <div className="sm:col-span-2 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Confirme o agendamento com os dados acima.
          </div>
          <Button type="submit" disabled={loading || !slot?.inicio}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" /> Enviando...
              </div>
            ) : (
              'Confirmar'
            )}
          </Button>
        </div>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {message && <p className="mt-2 text-sm text-green-700">{message}</p>}
    </Card>
  );
};

export default ConfirmBookingStep;
