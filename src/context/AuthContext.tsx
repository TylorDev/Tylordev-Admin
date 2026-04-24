import axios from 'axios';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { buildGithubLoginUrl, getSession, logoutSession } from '../api/auth';
import { AuthSession } from '../types/auth';

type AuthContextValue = {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  user: AuthSession | null;
  error: string | null;
  loginWithGithub: () => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getInitialAuthError() {
  const currentUrl = new URL(window.location.href);
  const authError = currentUrl.searchParams.get('authError');

  if (!authError) {
    return null;
  }

  currentUrl.searchParams.delete('authError');
  window.history.replaceState({}, '', currentUrl.toString());
  return authError;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthContextValue['status']>('loading');
  const [user, setUser] = useState<AuthSession | null>(null);
  const [error, setError] = useState<string | null>(() => getInitialAuthError());

  async function refreshSession() {
    try {
      const session = await getSession();
      setUser(session);
      setStatus('authenticated');
    } catch (requestError) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
        setUser(null);
        setStatus('unauthenticated');
        return;
      }

      setError('No se pudo validar la sesion con el backend.');
      setUser(null);
      setStatus('unauthenticated');
    }
  }

  useEffect(() => {
    refreshSession().catch(() => {
      setStatus('unauthenticated');
    });
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setStatus('unauthenticated');
      setError('Tu sesion expiro. Vuelve a entrar con GitHub.');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      error,
      loginWithGithub: () => {
        window.location.assign(buildGithubLoginUrl(window.location.href));
      },
      logout: async () => {
        await logoutSession();
        setUser(null);
        setStatus('unauthenticated');
      },
      refreshSession: async () => {
        setError(null);
        await refreshSession();
      },
    }),
    [error, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
