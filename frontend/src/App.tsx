import { useState } from 'react';
import { Route, Routes, Link, Outlet } from 'react-router-dom';
import ChooseBarberPage from './pages/ChooseBarberPage';
import ChooseServicePage from './pages/ChooseServicePage';
import ChooseDateStep from './pages/ChooseDateStep';
import ChooseTimeSlotStep from './pages/ChooseTimeSlotStep';
import ConfirmBookingStep from './pages/ConfirmBookingStep';
import BarberSelector from './pages/BarberSelector';
import AgendaDoDiaPage from './pages/AgendaDoDiaPage';
import ManageServicesPage from './pages/ManageServicesPage';
import ManageBarbersPage from './pages/ManageBarbersPage';
import ManageClientsPage from './pages/ManageClientsPage';
import AppLayout from './components/layout/AppLayout';
import Card from './components/ui/Card';
import ClientLoginPage from './pages/ClientLoginPage';
import ClientAppointmentsPage from './pages/ClientAppointmentsPage';
import { useAuth } from './context/AuthContext';

const Layout = () => (
  <AppLayout>
    <Outlet />
  </AppLayout>
);

const Home = () => (
  <div className="grid gap-4">
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold text-gray-900">Barbearia Agendamento</h1>
      <p className="text-lg text-gray-600">
        Agende horários, consulte a agenda do barbeiro e gerencie serviços, clientes e barbearias
        em uma interface moderna.
      </p>
    </div>
    <div className="grid gap-3 sm:grid-cols-3">
      <Card
        title="Agendar"
        subtitle="Clientes selecionam barbeiro, serviço, data e horário."
        actions={
          <Link
            to="/agendar"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-700"
          >
            Iniciar
          </Link>
        }
      >
        <p className="text-sm text-gray-600">
          Fluxo completo de agendamento com horários disponíveis em tempo real.
        </p>
      </Card>
      <Card
        title="Agenda"
        subtitle="Visualize e atualize os agendamentos do barbeiro."
        actions={
          <Link
            to="/agenda"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-700"
          >
            Abrir agenda
          </Link>
        }
      >
        <p className="text-sm text-gray-600">
          Marque como concluído, falta ou cancele com atualização instantânea.
        </p>
      </Card>
      <Card
        title="Admin"
        subtitle="Gerencie serviços, barbeiros e clientes."
        actions={
          <Link
            to="/admin"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-700"
          >
            Ir para Admin
          </Link>
        }
      >
        <p className="text-sm text-gray-600">
          Telas simples para criar e editar serviços, horários de trabalho e clientes.
        </p>
      </Card>
    </div>
  </div>
);

const Admin = () => (
  <div className="grid gap-4">
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">Administração</h2>
      <p className="text-gray-600">Selecione uma área para gerenciar.</p>
    </div>
    <div className="grid gap-3 sm:grid-cols-3">
      <Card
        title="Serviços"
        subtitle="Cadastre e atualize os serviços oferecidos."
        actions={
          <Link
            to="/admin/servicos"
            className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-700"
          >
            Gerenciar
          </Link>
        }
      >
        <p className="text-sm text-gray-600">Duração, preço e status de cada serviço.</p>
      </Card>
      <Card
        title="Barbeiros"
        subtitle="Gerencie barbearias e horários de trabalho."
        actions={
          <Link
            to="/admin/barbeiros"
            className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-700"
          >
            Gerenciar
          </Link>
        }
      >
        <p className="text-sm text-gray-600">Cadastre profissionais e defina disponibilidade.</p>
      </Card>
      <Card
        title="Clientes"
        subtitle="Visualize e desbloqueie clientes."
        actions={
          <Link
            to="/admin/clientes"
            className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-700"
          >
            Gerenciar
          </Link>
        }
      >
        <p className="text-sm text-gray-600">
          Consulte faltas, bloqueio e dados básicos dos clientes.
        </p>
      </Card>
    </div>
  </div>
);

const BookingFlow = () => {
  const { user } = useAuth();
  const [barbeiroId, setBarbeiroId] = useState<string>('');
  const [barbeiroNome, setBarbeiroNome] = useState<string>('');
  const [servicoId, setServicoId] = useState<string>('');
  const [servicoNome, setServicoNome] = useState<string>('');
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [dataSelecionadaStr, setDataSelecionadaStr] = useState<string>('');
  const [slotSelecionado, setSlotSelecionado] = useState<{ inicio: string; fim: string } | null>(
    null,
  );

  if (user.role !== 'cliente' || !user.cliente) {
    return (
      <Card
        title="Faça login para agendar"
        subtitle="Use seu nome e telefone e volte para concluir o agendamento."
      >
        <Link
          to="/login-cliente"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-700"
        >
          Ir para login
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Agendar horário</h2>
        <p className="text-gray-600">
          Siga as etapas abaixo para escolher barbeiro, serviço, data e horário.
        </p>
      </div>

      {/* Etapa 1: selecionar barbeiro */}
      {!barbeiroId && (
        <ChooseBarberPage
          selectedId={barbeiroId}
          onSelect={(barber) => {
            setBarbeiroId(barber.id);
            setBarbeiroNome(barber.nome);
            // limpar passos seguintes
            setServicoId('');
            setServicoNome('');
            setDataSelecionada(null);
            setDataSelecionadaStr('');
            setSlotSelecionado(null);
          }}
        />
      )}

      {/* Etapa 2: selecionar serviço */}
      {barbeiroId && !servicoId && (
        <ChooseServicePage
          selectedId={servicoId}
          onSelect={(service) => {
            setServicoId(service.id);
            setServicoNome(service.nome);
            setDataSelecionada(null);
            setDataSelecionadaStr('');
            setSlotSelecionado(null);
          }}
        />
      )}

      {/* Etapa 3: selecionar data */}
      {barbeiroId && servicoId && !dataSelecionada && (
        <ChooseDateStep
          value={dataSelecionadaStr}
          onDateSelected={(dateStr) => {
            setDataSelecionadaStr(dateStr);
            setDataSelecionada(new Date(`${dateStr}T12:00:00`));
            setSlotSelecionado(null);
          }}
        />
      )}

      {/* Etapa 4: selecionar horário */}
      {barbeiroId && servicoId && dataSelecionada && !slotSelecionado && (
        <ChooseTimeSlotStep
          barbeiroId={barbeiroId}
          servicoId={servicoId}
          date={dataSelecionada}
          selectedSlot={slotSelecionado}
          onSlotSelected={setSlotSelecionado}
        />
      )}

      {/* Etapa 5: confirmar */}
      {barbeiroId && servicoId && slotSelecionado && (
        <ConfirmBookingStep
          barbeiroId={barbeiroId}
          servicoId={servicoId}
          barbeiroNome={barbeiroNome}
          servicoNome={servicoNome}
          slot={slotSelecionado}
        />
      )}
    </div>
  );
};

const AgendaPage = () => {
  const [agendaBarbeiroId, setAgendaBarbeiroId] = useState<string>('');

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Agenda do barbeiro</h2>
        <p className="text-gray-600">Selecione um barbeiro para visualizar e gerenciar o dia.</p>
      </div>
      <Card title="Selecione o barbeiro" subtitle="Escolha quem está logado para consultar a agenda.">
        <BarberSelector onSelect={setAgendaBarbeiroId} />
      </Card>
      {agendaBarbeiroId ? (
        <AgendaDoDiaPage barbeiroId={agendaBarbeiroId} />
      ) : (
        <Card>
          <p className="text-sm text-gray-600">Selecione um barbeiro para ver a agenda.</p>
        </Card>
      )}
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/agendar" element={<BookingFlow />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/servicos" element={<ManageServicesPage />} />
        <Route path="/admin/barbeiros" element={<ManageBarbersPage />} />
        <Route path="/admin/clientes" element={<ManageClientsPage />} />
        <Route path="/login-cliente" element={<ClientLoginPage />} />
        <Route path="/meus-agendamentos" element={<ClientAppointmentsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
