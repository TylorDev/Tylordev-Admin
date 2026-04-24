import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../api/projects';
import { ProjectPreview } from '../components/ProjectPreview';
import { Button, TittleBar } from '../shared/frontend';
import { ProjectRecord } from '../types/content';

export function ProjectsListPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);

  useEffect(() => {
    getProjects().then(setProjects).catch(() => setProjects([]));
  }, []);

  return (
    <section className="admin-page">
      <div className="page-toolbar">
        <TittleBar tittle="Proyectos" handlePrev={() => undefined} handleNext={() => undefined} hideButtons={true} />
        <Link to="/projects/new" className="link-reset">
          <Button handleClick={() => undefined} text="Nuevo proyecto" />
        </Link>
      </div>

      <div className="card-grid">
        {projects.map((project) => (
          <Link key={project.slug} to={`/projects/${project.slug}`} className="link-reset">
            <ProjectPreview project={project} locale="es-mx" />
          </Link>
        ))}
      </div>
    </section>
  );
}
