import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { getErrorMessage } from '../utils/errorMessage';
import { cn } from '../utils/cn';

interface Service {
  id: string;
  nome: string;
  duracaoMinutos: number;
  preco: number;
  ativo: boolean;
}

interface Props {
  onSelect?: (servico: Service) => void;
  selectedId?: string;
}

const ChooseServicePage = ({ onSelect, selectedId }: Props) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
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
    fetchServices();
  }, []);

  return (
    <Card
      title="2. Escolha o serviço"
      subtitle="Selecione o tipo de atendimento desejado."
      className="border-dashed border-primary-100 w-full max-w-3xl mx-auto"
    >
      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Spinner size="sm" /> Carregando serviços...
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && services.length === 0 && (
        <div className="rounded-xl border border-gray-100 bg-white px-6 py-8 text-gray-500">
          Nenhum serviço cadastrado.
        </div>
      )}

      <div className="mt-3 space-y-4">
        {services.map((service) => {
          const isSelected = selectedId === service.id;
          return (
            <div
              key={service.id}
              onClick={() => onSelect?.(service)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect?.(service);
                }
              }}
              role="button"
              tabIndex={0}
              className={cn(
                'group flex w-full flex-col gap-2 rounded-2xl border p-4 text-left transition duration-200',
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-soft ring-2 ring-primary-200'
                  : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-soft',
                !service.ativo && 'opacity-70',
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className={cn(
                      'text-lg font-semibold',
                      isSelected ? 'text-primary-800' : 'text-gray-900',
                    )}
                  >
                    {service.nome}
                  </p>
                  <p className="text-sm text-gray-600">
                    {service.duracaoMinutos} min · R${service.preco}
                  </p>
                </div>
                <Button
                  type="button"
                  variant={isSelected ? 'primary' : 'secondary'}
                  size="sm"
                >
                  {isSelected ? 'Selecionado' : 'Selecionar'}
                </Button>
              </div>
              {!service.ativo && (
                <span className="inline-flex w-fit rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Inativo
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ChooseServicePage;
