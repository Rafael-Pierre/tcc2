import { useMemo, useState } from 'react';
import type { Task } from '../context/TaskContext';
import { useTasks } from '../context/TaskContext';
import { TaskModal } from '../components/TaskModal';

type Filter = 'all' | 'pending' | 'completed';

const TasksPage = () => {
  const { tasks, createTask, updateTask, deleteTask, toggleTaskStatus, loading } = useTasks();

  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const visibleTasks = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tasks
      .filter((task) => {
        if (filter === 'pending') return task.status === 'pending';
        if (filter === 'completed') return task.status === 'completed';
        return true;
      })
      .filter((task) => {
        if (!term) return true;
        return (
          task.title.toLowerCase().includes(term) ||
          task.description.toLowerCase().includes(term)
        );
      });
  }, [tasks, filter, search]);

  const handleCreateClick = () => {
    setModalMode('create');
    setSelectedTask(undefined);
    setModalOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setModalMode('edit');
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: { title: string; description: string }) => {
    if (modalMode === 'create') {
      await createTask(data);
    } else if (modalMode === 'edit' && selectedTask) {
      await updateTask(selectedTask.id, data);
    }
    setModalOpen(false);
  };

  const handleToggleStatus = async (task: Task) => {
    await toggleTaskStatus(task.id);
  };

  const handleDelete = async (task: Task) => {
    // Confirmação simples em memória para evitar cliques acidentais durante o experimento.
    const confirmed = window.confirm(`Remover a tarefa "${task.title}"?`);
    if (!confirmed) return;
    await deleteTask(task.id);
  };

  const total = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingCount = total - completedCount;

  return (
    <section>
      <h2 className="page-title">Tarefas do experimento</h2>
      <p className="page-subtitle">
        Utilize esta lista para seguir o roteiro experimental: criar, editar, concluir e filtrar tarefas.
      </p>

      <div className="card">
        <header className="card-header">
          <div>
            <h3 className="card-title">Lista de tarefas</h3>
            <p className="card-subtitle">
              As operações são executadas apenas em memória, simulando um fluxo de API REST.
            </p>
          </div>
          <button
            type="button"
            className="app-button app-button-neutral"
            onClick={handleCreateClick}
          >
            + Nova tarefa
          </button>
        </header>

        <div className="tasks-toolbar">
          <div className="tasks-filters" aria-label="Filtros de status de tarefa">
            <button
              type="button"
              className={`tasks-filter-button ${filter === 'all' ? 'is-active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas
            </button>
            <button
              type="button"
              className={`tasks-filter-button ${filter === 'pending' ? 'is-active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pendentes
            </button>
            <button
              type="button"
              className={`tasks-filter-button ${filter === 'completed' ? 'is-active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Concluídas
            </button>
          </div>

          <div className="tasks-search">
            <input
              type="search"
              className="form-input"
              placeholder="Buscar por título ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <span className="muted-text">
            Total: {total} • Pendentes: {pendingCount} • Concluídas: {completedCount}
          </span>
        </div>

        <div className="tasks-list">
          {loading && (
            <div className="tasks-list-empty">Carregando tarefas simuladas...</div>
          )}
          {!loading && visibleTasks.length === 0 && (
            <div className="tasks-list-empty">
              Nenhuma tarefa encontrada com os filtros atuais.
            </div>
          )}
          {!loading &&
            visibleTasks.map((task) => (
              <article
                key={task.id}
                className={`task-row ${task.status === 'completed' ? 'is-completed' : ''}`}
              >
                <button
                  type="button"
                  className={`task-toggle ${
                    task.status === 'completed' ? 'is-completed' : ''
                  }`}
                  onClick={() => handleToggleStatus(task)}
                  aria-label={
                    task.status === 'completed'
                      ? 'Marcar tarefa como pendente'
                      : 'Marcar tarefa como concluída'
                  }
                >
                  <span className="task-toggle-inner" />
                </button>

                <div className="task-main">
                  <div className="task-title">{task.title}</div>
                  <div className="task-description">{task.description}</div>
                  <div className="task-meta">
                    <span className={`task-chip ${task.status}`}>
                      {task.status === 'completed' ? 'Concluída' : 'Pendente'}
                    </span>
                    <span>
                      Criada em{' '}
                      {new Date(task.createdAt).toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                </div>

                <div className="task-actions">
                  <button
                    type="button"
                    className="app-button app-button-neutral"
                    onClick={() => handleEditClick(task)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="app-button app-button-ghost"
                    onClick={() => handleDelete(task)}
                  >
                    Excluir
                  </button>
                </div>
              </article>
            ))}
        </div>
      </div>

      <TaskModal
        open={modalOpen}
        mode={modalMode}
        initialTask={selectedTask}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </section>
  );
};

export default TasksPage;

