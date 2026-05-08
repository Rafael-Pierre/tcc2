import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { TaskModalComponent } from '../../components/task-modal/task-modal.component';

type Filter = 'all' | TaskStatus;

@Component({
  selector: 'tf-tasks-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskModalComponent],
  template: `
    <section>
      <h2 class="page-title">Tarefas do experimento</h2>
      <p class="page-subtitle">
        Utilize esta lista para seguir o roteiro experimental: criar, editar, concluir e filtrar tarefas.
      </p>

      <div class="card">
        <header class="card-header">
          <div>
            <h3 class="card-title">Lista de tarefas</h3>
            <p class="card-subtitle">
              As operações são executadas apenas em memória, simulando um fluxo de API REST.
            </p>
          </div>
          <button type="button" class="app-button app-button-neutral" (click)="openCreate()">
            + Nova tarefa
          </button>
        </header>

        <div class="tasks-toolbar">
          <div class="tasks-filters" aria-label="Filtros de status de tarefa">
            <button
              type="button"
              class="tasks-filter-button"
              [class.is-active]="filter() === 'all'"
              (click)="setFilter('all')"
            >
              Todas
            </button>
            <button
              type="button"
              class="tasks-filter-button"
              [class.is-active]="filter() === 'pending'"
              (click)="setFilter('pending')"
            >
              Pendentes
            </button>
            <button
              type="button"
              class="tasks-filter-button"
              [class.is-active]="filter() === 'completed'"
              (click)="setFilter('completed')"
            >
              Concluídas
            </button>
          </div>

          <div class="tasks-search">
            <input
              type="search"
              class="form-input"
              placeholder="Buscar por título ou descrição..."
              [ngModel]="search()"
              (ngModelChange)="search.set($event)"
            />
          </div>

          @if (summary(); as s) {
            <span class="muted-text">
              Total: {{ s.total }} • Pendentes: {{ s.pending }} • Concluídas: {{ s.completed }}
            </span>
          }
        </div>

        <div class="tasks-list">
          @if (taskService.loading()) {
            <div class="tasks-list-empty">Carregando tarefas simuladas...</div>
          } @else if (visibleTasks().length === 0) {
            <div class="tasks-list-empty">Nenhuma tarefa encontrada com os filtros atuais.</div>
          } @else {
            @for (task of visibleTasks(); track task.id) {
              <article
                class="task-row"
                [class.is-completed]="task.status === 'completed'"
              >
                <button
                  type="button"
                  class="task-toggle"
                  [class.is-completed]="task.status === 'completed'"
                  (click)="toggleStatus(task)"
                  [attr.aria-label]="
                    task.status === 'completed'
                      ? 'Marcar tarefa como pendente'
                      : 'Marcar tarefa como concluída'
                  "
                >
                  <span class="task-toggle-inner"></span>
                </button>

                <div class="task-main">
                  <div class="task-title">{{ task.title }}</div>
                  <div class="task-description">{{ task.description }}</div>
                  <div class="task-meta">
                    <span
                      class="task-chip"
                      [class.completed]="task.status === 'completed'"
                      [class.pending]="task.status === 'pending'"
                    >
                      {{ task.status === 'completed' ? 'Concluída' : 'Pendente' }}
                    </span>
                    <span>
                      Criada em
                      {{ task.createdAt | date: 'short' : undefined : 'pt-BR' }}
                    </span>
                  </div>
                </div>

                <div class="task-actions">
                  <button
                    type="button"
                    class="app-button app-button-neutral"
                    (click)="openEdit(task)"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    class="app-button app-button-ghost"
                    (click)="delete(task)"
                  >
                    Excluir
                  </button>
                </div>
              </article>
            }
          }
        </div>
      </div>

      <tf-task-modal
        [open]="modalOpen()"
        [mode]="modalMode()"
        [initialTask]="selectedTask()"
        (onClose)="closeModal()"
        (submitTask)="handleModalSubmit($event)"
      ></tf-task-modal>
    </section>
  `,
})
export class TasksComponent {
  readonly filter = signal<Filter>('all');
  readonly search = signal('');

  readonly modalOpen = signal(false);
  readonly modalMode = signal<'create' | 'edit'>('create');
  readonly selectedTask = signal<Task | null>(null);

  readonly visibleTasks = computed(() => {
    const tasks = this.taskService.tasks();
    const filter = this.filter();
    const term = this.search().trim().toLowerCase();

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
  });

  readonly summary = computed(() => {
    const tasks = this.taskService.tasks();
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = total - completed;
    return { total, completed, pending };
  });

  constructor(public readonly taskService: TaskService) {}

  setFilter(value: Filter): void {
    this.filter.set(value);
  }

  openCreate(): void {
    this.modalMode.set('create');
    this.selectedTask.set(null);
    this.modalOpen.set(true);
  }

  openEdit(task: Task): void {
    this.modalMode.set('edit');
    this.selectedTask.set(task);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  async handleModalSubmit(data: { title: string; description: string }): Promise<void> {
    this.modalOpen.set(false);
    const mode = this.modalMode();
    const selected = this.selectedTask();

    try {
      if (mode === 'create') {
        await this.taskService.createTask(data);
      } else if (mode === 'edit' && selected) {
        await this.taskService.updateTask(selected.id, data);
      }
    } catch (error) {
      // Em caso de falha, reabre o modal para o usuário tentar novamente.
      console.error(error);
      alert('Não foi possível salvar a tarefa. Tente novamente.');
      if (mode === 'edit') {
        this.selectedTask.set(selected);
        this.modalMode.set('edit');
      } else {
        this.selectedTask.set(null);
        this.modalMode.set('create');
      }
      this.modalOpen.set(true);
    }
  }

  async toggleStatus(task: Task): Promise<void> {
    await this.taskService.toggleTaskStatus(task.id);
  }

  async delete(task: Task): Promise<void> {
    const confirmed = window.confirm(`Remover a tarefa "${task.title}"?`);
    if (!confirmed) return;
    await this.taskService.deleteTask(task.id);
  }
}

