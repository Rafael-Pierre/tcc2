import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'tf-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section>
      <h2 class="page-title">Visão geral das tarefas</h2>
      <p class="page-subtitle">
        Este dashboard resume o andamento das tarefas utilizadas no experimento.
      </p>

      <div class="card">
        <header class="card-header">
          <div>
            <h3 class="card-title">Métricas de execução</h3>
            <p class="card-subtitle">
              Os valores abaixo são calculados em tempo real a partir da lista de tarefas.
            </p>
          </div>
          <span class="app-badge">
            <span class="app-badge-dot"></span>
            Ambiente simulado
          </span>
        </header>

        <ng-container *ngIf="vm() as vm">
          <div class="card-grid">
            <div class="metric-card">
              <div class="metric-label">Total de tarefas</div>
              <div class="metric-value">{{ vm.total }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Tarefas concluídas</div>
              <div class="metric-value">{{ vm.completed }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Tarefas pendentes</div>
              <div class="metric-value">{{ vm.pending }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Percentual de conclusão</div>
              <div class="metric-value">
                {{ vm.completion }}%
                <span class="metric-badge">
                  {{
                    vm.completion >= 80 ? 'Alto' : vm.completion >= 40 ? 'Moderado' : 'Inicial'
                  }}
                </span>
              </div>
            </div>
          </div>

          <div class="dashboard-chart">
            <div class="dashboard-chart-bar">
              <div
                class="dashboard-chart-fill"
                [style.width.%]="vm.completion"
              ></div>
            </div>
            <div class="dashboard-chart-labels">
              <span>Pendentes: {{ vm.pending }}</span>
              <span>Concluídas: {{ vm.completed }}</span>
            </div>
          </div>
        </ng-container>

        <p class="muted-text" style="margin-top: 0.9rem;">
          Este gráfico é construído apenas com HTML e CSS para preservar o controle do experimento,
          sem bibliotecas de visualização.
        </p>
      </div>
    </section>
  `,
})
export class DashboardComponent {
  constructor(private readonly taskService: TaskService) {}

  vm = () => {
    const tasks = this.taskService.tasks();
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = total - completed;
    const completion = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, pending, completion };
  };
}

