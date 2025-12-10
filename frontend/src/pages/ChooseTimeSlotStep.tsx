import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { getErrorMessage } from '../utils/errorMessage';
import { formatTime } from '../utils/time';

interface Slot {
  inicio: string;
  fim: string;
}

interface Props {
  barbeiroId: string;
  servicoId: string;
  date: Date;
  onSlotSelected: (slot: Slot) => void;
  selectedSlot?: Slot | null;
}

const hourFromISO = (iso: string) => new Date(iso).getUTCHours();

const ChooseTimeSlotStep = ({
  barbeiroId,
  servicoId,
  date,
  onSlotSelected,
  selectedSlot,
}: Props) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!barbeiroId || !servicoId || !date) return;
    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<Slot[]>('/disponibilidade', {
          params: {
            barbeiroId,
            servicoId,
            data: date.toISOString(),
          },
        });
        setSlots(res.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Erro ao carregar horários'));
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [barbeiroId, servicoId, date]);

  const selectedStart = selectedSlot?.inicio;

  const sections = [
    { title: 'Manhã', filter: (h: number) => h < 12 },
    { title: 'Tarde', filter: (h: number) => h >= 12 && h < 18 },
    { title: 'Noite', filter: (h: number) => h >= 18 },
  ];

  return (
    <Card
      title="4. Escolha o horário"
      subtitle="Selecione um horário disponível para o serviço."
      className="border-dashed border-primary-100 w-full max-w-4xl mx-auto"
    >
      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Spinner size="sm" /> Buscando horários disponíveis...
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && slots.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-600">
          Nenhum horário disponível para esta data.
        </div>
      )}

      {!loading &&
        !error &&
        sections.map(({ title, filter }) => {
          const sectionSlots = slots.filter((slot) => filter(hourFromISO(slot.inicio)));
          if (sectionSlots.length === 0) return null;
          return (
            <div key={title} className="mb-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
                {title}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {sectionSlots.map((slot) => {
                  const isSelected = selectedStart === slot.inicio;
                  return (
                    <Button
                      key={slot.inicio}
                      type="button"
                      variant={isSelected ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => onSlotSelected(slot)}
                      className="w-full"
                    >
                      {formatTime(slot.inicio)}
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}
    </Card>
  );
};

export default ChooseTimeSlotStep;
