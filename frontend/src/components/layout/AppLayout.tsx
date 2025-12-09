import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface Props {
  children: ReactNode;
}

const navItems = [
  { to: '/', label: 'Início' },
  { to: '/agendar', label: 'Agendar' },
  { to: '/agenda', label: 'Agenda' },
  { to: '/admin', label: 'Admin' },
];

export const AppLayout = ({ children }: Props) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold text-primary-700">
            Barbearia • Agendamentos
          </Link>
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
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
