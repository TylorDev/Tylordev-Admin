import { useEffect, useState } from 'react';
import { getArticles } from '../api/articles';
import { getProjects } from '../api/projects';
import { DashboardStats } from '../components/DashboardStats';
import { TittleBar } from '../shared/frontend';

export function DashboardPage() {
  const [projectCount, setProjectCount] = useState<number>(0);
  const [articleCount, setArticleCount] = useState<number>(0);

  useEffect(() => {
    Promise.all([getProjects(), getArticles()])
      .then(([projects, articles]) => {
        setProjectCount(projects.length);
        setArticleCount(articles.length);
      })
      .catch(() => {
        setProjectCount(0);
        setArticleCount(0);
      });
  }, []);

  return (
    <section className="admin-page">
      <TittleBar tittle="Resumen" handlePrev={() => undefined} handleNext={() => undefined} hideButtons={true} />

      <div className="dashboard-grid">
        <DashboardStats label="Proyectos" value={projectCount} helper="Contenido administrado desde PostgreSQL." />
        <DashboardStats label="Posts" value={articleCount} helper="Cada entrada mantiene 3 traducciones." />
        <DashboardStats label="Idiomas" value="3" helper="en-us, es-mx y pt-br obligatorios para no romper la web." />
      </div>
    </section>
  );
}
