import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
});

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
