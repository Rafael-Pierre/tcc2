import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import type { Task } from '../context/TaskContext';

interface TaskModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialTask?: Task;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string }) => void;
}

export const TaskModal = ({ open, mode, initialTask, onClose, onSubmit }: TaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open && initialTask && mode === 'edit') {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setTouched(false);
    }
    if (open && mode === 'create') {
      setTitle('');
      setDescription('');
      setTouched(false);
    }
  }, [open, initialTask, mode]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (!title.trim() || !description.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim() });
  };

  const hasError = touched && (!title.trim() || !description.trim());

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <header className="modal-header">
          <h2 className="modal-title">
            {mode === 'create' ? 'Criar tarefa' : 'Editar tarefa'}
          </h2>
        </header>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="task-title" className="form-label">
              Título
            </label>
            <input
              id="task-title"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Revisar questionário SUS"
            />
          </div>
          <div className="form-field">
            <label htmlFor="task-description" className="form-label">
              Descrição
            </label>
            <textarea
              id="task-description"
              className="form-input form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes adicionais da atividade..."
            />
          </div>
          {hasError && (
            <p className="form-error">Título e descrição são obrigatórios.</p>
          )}
          <footer className="modal-footer">
            <button
              type="button"
              className="app-button app-button-ghost"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="app-button">
              {mode === 'create' ? 'Criar' : 'Salvar'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

