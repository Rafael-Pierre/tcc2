import { useTasks } from '../context/TaskContext';

const DashboardPage = () => {
  const { tasks } = useTasks();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = total - completed;
  const completion = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section>
      <h2 className="page-title">Visão geral das tarefas</h2>
      <p className="page-subtitle">
        Este dashboard resume o andamento das tarefas utilizadas no experimento.
      </p>

      <div className="card">
        <header className="card-header">
          <div>
            <h3 className="card-title">Métricas de execução</h3>
            <p className="card-subtitle">
              Os valores abaixo são calculados em tempo real a partir da lista de tarefas.
            </p>
          </div>
          <span className="app-badge">
            <span className="app-badge-dot" />
            Ambiente simulado
          </span>
        </header>

        <div className="card-grid">
          <div className="metric-card">
            <div className="metric-label">Total de tarefas</div>
            <div className="metric-value">{total}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Tarefas concluídas</div>
            <div className="metric-value">{completed}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Tarefas pendentes</div>
            <div className="metric-value">{pending}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Percentual de conclusão</div>
            <div className="metric-value">
              {completion}%
              <span className="metric-badge">
                {completion >= 80 ? 'Alto' : completion >= 40 ? 'Moderado' : 'Inicial'}
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-chart">
          <div className="dashboard-chart-bar">
            <div
              className="dashboard-chart-fill"
              style={{ width: `${completion}%` }}
            />
          </div>
          <div className="dashboard-chart-labels">
            <span>Pendentes: {pending}</span>
            <span>Concluídas: {completed}</span>
          </div>
        </div>

        <p className="muted-text" style={{ marginTop: '0.9rem' }}>
          Este gráfico é construído apenas com HTML e CSS para preservar o controle do experimento,
          sem bibliotecas de visualização.
        </p>
      </div>
    </section>
  );
};

export default DashboardPage;

