import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

interface Props {
  children: ReactNode;
}

export const AppLayout = ({ children }: Props) => {
  const location = useLocation();
  const { user } = useAuth();

  const isAgendaRoute =
    location.pathname === '/agenda' || location.pathname.startsWith('/agenda/');

  const hideNav =
    location.pathname === '/login-cliente' ||
    location.pathname === '/login-staff' ||
    isAgendaRoute;
  const showBrand = user.role !== 'cliente';

  const navItems = (() => {
    if (user.role === 'cliente') {
      return [
        { to: '/agendar', label: 'Agendar' },
        { to: '/meus-agendamentos', label: 'Meus agendamentos' },
      ];
    }

    if (user.role === 'staff') {
      return [
        { to: '/agenda', label: 'Agenda' },
        { to: '/admin', label: 'Admin' },
      ];
    }

    let items = [
      { to: '/', label: 'Início' },
      { to: '/agendar', label: 'Agendar' },
      { to: '/meus-agendamentos', label: 'Meus agendamentos' },
      { to: '/agenda', label: 'Agenda' },
      { to: '/admin', label: 'Admin' },
      { to: '/login-cliente', label: 'Login' },
    ];

    if (isAgendaRoute) {
      items = items.filter(
        (item) => item.label !== 'Agendar' && item.label !== 'Meus agendamentos',
      );
    }

    return items;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-x-hidden">
      {!hideNav && (
        <header className="border-b border-gray-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
            {showBrand ? (
              <Link to="/" className="text-xl font-bold text-primary-700">
                Barbearia • Agendamentos
              </Link>
            ) : (
              <div className="h-6" />
            )}
            <nav className="flex items-center gap-3 text-sm font-medium text-gray-700">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'rounded-lg px-3 py-2 transition hover:bg-primary-50 hover:text-primary-700',
                    location.pathname === item.to &&
                      'bg-primary-50 text-primary-700 border border-primary-100',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
      )}
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="grid gap-6">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
