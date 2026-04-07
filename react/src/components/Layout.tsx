import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { logout, isAuthenticated, userEmail } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const total = tasks.length || 1;
  const percentage = Math.round((completed / total) * 100);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-logo">TF</span>
          <div className="app-title-group">
            <h1 className="app-title">TaskFlow Experimental App</h1>
            <span className="app-subtitle">Framework Performance Study</span>
          </div>
        </div>
        {isAuthenticated && (
          <div className="app-header-right">
            <nav className="app-nav">
              <NavLink to="/dashboard" className="app-nav-link">
                Dashboard
              </NavLink>
              <NavLink to="/tasks" className="app-nav-link">
                Tarefas
              </NavLink>
            </nav>
            <div className="app-user-area">
              <div className="app-user-info">
                <span className="app-user-email">{userEmail}</span>
                <div className="app-user-progress">
                  <span className="app-user-progress-label">Conclusão</span>
                  <div className="app-progress-bar">
                    <div className="app-progress-bar-fill" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              </div>
              <button type="button" className="app-button app-button-ghost" onClick={handleLogout}>
                Sair
              </button>
            </div>
          </div>
        )}
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
};

