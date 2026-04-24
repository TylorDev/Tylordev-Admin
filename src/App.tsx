import { NavLink, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { ArticlesListPage } from './pages/ArticlesListPage';
import { ArticleEditorPage } from './pages/ArticleEditorPage';
import { ProjectEditorPage } from './pages/ProjectEditorPage';
import { ProjectsListPage } from './pages/ProjectsListPage';
import './App.scss';

function App() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="eyebrow">TylorDev</span>
          <h1>Admin CMS</h1>
          <p>Panel para proyectos y blog en `en-us`, `es-mx` y `pt-br`.</p>
        </div>

        <nav className="admin-sidebar__nav">
          <NavLink to="/" end>
            Resumen
          </NavLink>
          <NavLink to="/projects">Proyectos</NavLink>
          <NavLink to="/articles">Blog</NavLink>
        </nav>
      </aside>

      <main className="admin-main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsListPage />} />
          <Route path="/projects/new" element={<ProjectEditorPage mode="create" />} />
          <Route path="/projects/:slug" element={<ProjectEditorPage mode="edit" />} />
          <Route path="/articles" element={<ArticlesListPage />} />
          <Route path="/articles/new" element={<ArticleEditorPage mode="create" />} />
          <Route path="/articles/:slug" element={<ArticleEditorPage mode="edit" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
