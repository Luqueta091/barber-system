import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

type Role = 'cliente' | 'staff' | null;

interface ClienteSession {
  id: string;
  nome: string;
  telefone: string;
}

interface AuthState {
  role: Role;
  cliente?: ClienteSession;
}

interface AuthContextValue {
  user: AuthState;
  loginCliente: (session: ClienteSession) => void;
  loginStaff: () => void;
  logout: () => void;
}

const STORAGE_KEY = 'barbearia-auth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthState>({ role: null });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AuthState;
        setUser(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const loginCliente = useCallback((session: ClienteSession) => {
    setUser({ role: 'cliente', cliente: session });
  }, []);

  const loginStaff = useCallback(() => {
    setUser({ role: 'staff' });
  }, []);

  const logout = useCallback(() => {
    setUser({ role: null });
  }, []);

  const value = useMemo(
    () => ({
      user,
      loginCliente,
      loginStaff,
      logout,
    }),
    [user, loginCliente, loginStaff, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
