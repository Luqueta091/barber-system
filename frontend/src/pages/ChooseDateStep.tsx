import { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';

interface Props {
  onDateSelected: (date: string) => void;
  value?: string;
}

const formatDateValue = (date: Date) => date.toISOString().split('T')[0];
const dayLabel = (date: Date) =>
  date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
const monthLabel = (date: Date) => date.toLocaleDateString('pt-BR', { month: 'long' });

const ChooseDateStep = ({ onDateSelected, value }: Props) => {
  const [dates, setDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const nextDates: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      nextDates.push(d);
    }
    setDates(nextDates);
    setLoading(false);
  }, []);

  const currentMonth = useMemo(() => (dates[0] ? monthLabel(dates[0]) : ''), [dates]);

  return (
    <Card
      title="3. Escolha a data"
      subtitle="Selecione o dia do atendimento."
      className="border-dashed border-primary-100 w-full max-w-4xl mx-auto"
    >
      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 w-20 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between pb-2">
            <p className="text-sm capitalize text-gray-600">{currentMonth}</p>
            {!value && (
              <span className="text-xs text-gray-500">Selecione um dia para ver horários</span>
            )}
          </div>
          <div className="flex snap-x gap-3 overflow-x-auto pb-2">
            {dates.map((date) => {
              const selected = value === formatDateValue(date);
              const isToday = new Date().toDateString() === date.toDateString();

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => onDateSelected(formatDateValue(date))}
                  className={`snap-start w-20 shrink-0 rounded-2xl border px-3 py-4 text-center transition ${
                    selected
                      ? 'border-primary-500 bg-primary-600 text-white shadow-soft'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  <span
                    className={`block text-xs font-semibold uppercase tracking-wide ${
                      selected ? 'text-primary-100' : 'text-gray-500'
                    }`}
                  >
                    {dayLabel(date)}
                  </span>
                  <span className="text-2xl font-bold leading-tight">
                    {date.getDate().toString().padStart(2, '0')}
                  </span>
                  {isToday && (
                    <span
                      className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        selected ? 'bg-primary-500 text-white' : 'bg-green-100 text-green-700'
                      }`}
                    >
                      Hoje
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </Card>
  );
};

export default ChooseDateStep;
