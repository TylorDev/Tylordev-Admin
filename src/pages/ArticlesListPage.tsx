import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../api/articles';
import { ArticlePreview } from '../components/ArticlePreview';
import { Button, TittleBar } from '../shared/frontend';
import { ArticleRecord } from '../types/content';

export function ArticlesListPage() {
  const [articles, setArticles] = useState<ArticleRecord[]>([]);

  useEffect(() => {
    getArticles().then(setArticles).catch(() => setArticles([]));
  }, []);

  return (
    <section className="admin-page">
      <div className="page-toolbar">
        <TittleBar tittle="Blog" handlePrev={() => undefined} handleNext={() => undefined} hideButtons={true} />
        <Link to="/articles/new" className="link-reset">
          <Button handleClick={() => undefined} text="Nuevo post" />
        </Link>
      </div>

      <div className="card-grid">
        {articles.map((article) => (
          <Link key={article.slug} to={`/articles/${article.slug}`} className="link-reset">
            <ArticlePreview article={article} locale="es-mx" />
          </Link>
        ))}
      </div>
    </section>
  );
}
