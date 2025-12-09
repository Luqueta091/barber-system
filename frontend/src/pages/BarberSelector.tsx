import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';
import { getErrorMessage } from '../utils/errorMessage';

interface Barber {
  id: string;
  nome: string;
}

interface Props {
  onSelect?: (barberId: string) => void;
}

const BarberSelector = ({ onSelect }: Props) => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selected, setSelected] = useState<string>('');
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

  const handleSelect = (id: string) => {
    setSelected(id);
    onSelect?.(id);
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <Select
          label="Selecionar barbeiro"
          value={selected}
          onChange={(e) => handleSelect(e.target.value)}
        >
          <option value="">Selecione</option>
          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.nome}
            </option>
          ))}
        </Select>
        {loading && <Spinner size="sm" />}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default BarberSelector;
