import { api } from './client';
import { ArticleRecord } from '../types/content';
import { normalizeArticlePayload } from '../utils/mappers';

export async function getArticles() {
  const { data } = await api.get<ArticleRecord[]>('/articles');
  return data.map((article) => ({
    ...article,
    publishedAt: article.publishedAt ? article.publishedAt.slice(0, 10) : '',
  }));
}

export async function getArticle(slug: string) {
  const { data } = await api.get<ArticleRecord>(`/articles/${slug}`);
  return {
    ...data,
    publishedAt: data.publishedAt ? data.publishedAt.slice(0, 10) : '',
  };
}

export async function createArticle(article: ArticleRecord) {
  const { data } = await api.post<ArticleRecord>('/articles', normalizeArticlePayload(article));
  return data;
}

export async function updateArticle(slug: string, article: ArticleRecord) {
  const { data } = await api.put<ArticleRecord>(`/articles/${slug}`, normalizeArticlePayload(article));
  return data;
}

export async function deleteArticle(slug: string) {
  await api.delete(`/articles/${slug}`);
}
