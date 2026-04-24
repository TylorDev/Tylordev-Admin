import { api } from './client';
import { ProjectRecord } from '../types/content';
import { normalizeProjectPayload } from '../utils/mappers';

export async function getProjects() {
  const { data } = await api.get<ProjectRecord[]>('/projects');
  return data.map((project) => ({
    ...project,
    publishedAt: project.publishedAt ? project.publishedAt.slice(0, 10) : '',
  }));
}

export async function getProject(slug: string) {
  const { data } = await api.get<ProjectRecord>(`/projects/${slug}`);
  return {
    ...data,
    publishedAt: data.publishedAt ? data.publishedAt.slice(0, 10) : '',
  };
}

export async function createProject(project: ProjectRecord) {
  const { data } = await api.post<ProjectRecord>('/projects', normalizeProjectPayload(project));
  return data;
}

export async function updateProject(slug: string, project: ProjectRecord) {
  const { data } = await api.put<ProjectRecord>(`/projects/${slug}`, normalizeProjectPayload(project));
  return data;
}

export async function deleteProject(slug: string) {
  await api.delete(`/projects/${slug}`);
}
