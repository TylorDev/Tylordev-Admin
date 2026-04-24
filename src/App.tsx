import { NavLink, Route, Routes } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import { useAuth } from './context/AuthContext';
import { DashboardPage } from './pages/DashboardPage';
import { ArticlesListPage } from './pages/ArticlesListPage';
import { ArticleEditorPage } from './pages/ArticleEditorPage';
import { ProjectEditorPage } from './pages/ProjectEditorPage';
import { ProjectsListPage } from './pages/ProjectsListPage';
import './App.scss';

function App() {
  const { error, loginWithGithub, logout, status, user } = useAuth();

  if (status === 'loading') {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <span className="eyebrow">Admin access</span>
          <h1>Validando sesion</h1>
          <p>Comprobando si ya existe una sesion activa con GitHub.</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <span className="eyebrow">Solo para TylorDev</span>
          <h1>Entrar al panel</h1>
          <p>
            Este CMS no tiene registro abierto. Solo acepta una cuenta de GitHub
            autorizada: <strong>@TylorDev</strong>.
          </p>
          {error ? (
            <div className="form-feedback error">
              <strong>Login bloqueado</strong>
              <span>{error}</span>
            </div>
          ) : null}
          <button type="button" className="github-login-button" onClick={loginWithGithub}>
            <FaGithub />
            Entrar con GitHub
          </button>
        </div>
      </div>
    );
  }

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

        <div className="admin-sidebar__session">
          <div className="session-card">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.login} /> : <div className="session-card__avatar">{user?.login[0]}</div>}
            <div>
              <strong>{user?.name ?? user?.login}</strong>
              <span>@{user?.login}</span>
            </div>
          </div>

          <button type="button" className="logout-button" onClick={() => logout()}>
            Cerrar sesion
          </button>
        </div>
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
