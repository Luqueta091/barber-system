import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { getErrorMessage } from '../utils/errorMessage';
import { cn } from '../utils/cn';

interface Barber {
  id: string;
  nome: string;
  telefone: string;
  ativo: boolean;
}

interface Props {
  onSelect?: (barber: Barber) => void;
  selectedId?: string;
}

const ChooseBarberPage = ({ onSelect, selectedId }: Props) => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBarbers = async () => {
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
    fetchBarbers();
  }, []);

  return (
    <Card
      title="1. Escolha o barbeiro"
      subtitle="Selecione o profissional que fará o atendimento."
      className="border-dashed border-primary-100 w-full max-w-4xl mx-auto"
    >
      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Spinner size="sm" /> Carregando barbeiros...
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && barbers.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white px-6 py-8 text-gray-500">
          <p>Nenhum barbeiro disponível no momento.</p>
        </div>
      )}

      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {barbers.map((barber) => {
          const isSelected = selectedId === barber.id;
          return (
            <div
              key={barber.id}
              onClick={() => onSelect?.(barber)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect?.(barber);
                }
              }}
              role="button"
              tabIndex={0}
              className={cn(
                'relative flex h-full flex-col gap-3 rounded-2xl border p-4 text-left transition duration-200',
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-soft ring-2 ring-primary-300'
                  : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-soft',
                !barber.ativo && 'opacity-70',
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{barber.nome}</p>
                  <p className="text-sm text-gray-500">{barber.telefone}</p>
                </div>
                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold',
                    barber.ativo
                      ? 'bg-green-50 text-green-700 border border-green-100'
                      : 'bg-amber-50 text-amber-700 border border-amber-100',
                  )}
                >
                  {barber.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <Button
                type="button"
                variant={isSelected ? 'primary' : 'secondary'}
                size="sm"
                fullWidth
              >
                {isSelected ? 'Selecionado' : 'Selecionar'}
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ChooseBarberPage;
