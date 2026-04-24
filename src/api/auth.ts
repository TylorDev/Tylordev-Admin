import { API_URL, api } from './client';
import { AuthSession } from '../types/auth';

export async function getSession() {
  const { data } = await api.get<AuthSession>('/auth/session');
  return data;
}

export async function logoutSession() {
  await api.post('/auth/logout');
}

export function buildGithubLoginUrl(returnTo = window.location.href) {
  const url = new URL('/auth/github/start', API_URL);
  url.searchParams.set('returnTo', returnTo);
  return url.toString();
}
