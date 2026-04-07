import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task';

@Component({
  selector: 'tf-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" role="dialog" aria-modal="true" *ngIf="open">
      <div class="modal">
        <header class="modal-header">
          <h2 class="modal-title">
            {{ mode === 'create' ? 'Criar tarefa' : 'Editar tarefa' }}
          </h2>
        </header>

        <form class="modal-body" (ngSubmit)="onSubmitInternal()" novalidate>
          <div class="form-field">
            <label class="form-label" for="task-title">Título</label>
            <input
              id="task-title"
              class="form-input"
              [(ngModel)]="title"
              name="title"
              placeholder="Ex.: Revisar questionário SUS"
            />
          </div>

          <div class="form-field">
            <label class="form-label" for="task-description">Descrição</label>
            <textarea
              id="task-description"
              class="form-input form-textarea"
              [(ngModel)]="description"
              name="description"
              placeholder="Detalhes adicionais da atividade..."
            ></textarea>
          </div>

          <p *ngIf="hasError()" class="form-error">
            Título e descrição são obrigatórios.
          </p>

          <footer class="modal-footer">
            <button type="button" class="app-button app-button-ghost" (click)="onClose.emit()">
              Cancelar
            </button>
            <button type="submit" class="app-button">
              {{ mode === 'create' ? 'Criar' : 'Salvar' }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  `,
})
export class TaskModalComponent {
  @Input() open = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialTask: Task | null = null;

  @Output() submitTask = new EventEmitter<{ title: string; description: string }>();
  @Output() onClose = new EventEmitter<void>();

  title = '';
  description = '';
  touched = false;

  ngOnChanges(): void {
    if (this.open && this.initialTask && this.mode === 'edit') {
      this.title = this.initialTask.title;
      this.description = this.initialTask.description;
      this.touched = false;
    }
    if (this.open && this.mode === 'create') {
      this.title = '';
      this.description = '';
      this.touched = false;
    }
  }

  hasError(): boolean {
    return this.touched && (!this.title.trim() || !this.description.trim());
  }

  onSubmitInternal(): void {
    this.touched = true;
    if (!this.title.trim() || !this.description.trim()) {
      return;
    }
    this.submitTask.emit({
      title: this.title.trim(),
      description: this.description.trim(),
    });
  }
}

