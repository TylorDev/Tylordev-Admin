import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config?.url !== '/auth/session'
    ) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    return Promise.reject(error);
  },
);

export function extractApiErrors(error: unknown) {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data;

    if (Array.isArray(payload?.message)) {
      return payload.message.map((message: unknown) => String(message));
    }

    if (typeof payload?.message === 'string') {
      return [payload.message];
    }

    if (typeof error.message === 'string' && error.message.trim()) {
      return [error.message];
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return [error.message];
  }

  return ['Ocurrio un error inesperado.'];
}
