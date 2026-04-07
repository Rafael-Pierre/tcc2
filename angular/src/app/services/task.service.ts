import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task';

let currentId = 1;

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  readonly baseUrl = '/api/tasks';

  readonly tasks = signal<Task[]>([]);
  readonly loading = signal<boolean>(false);

  constructor() {
    this.loadInitialMock();
  }

  private async loadInitialMock(): Promise<void> {
    this.loading.set(true);
    await this.simulateDelay(100);
    this.tasks.set([]);
    this.loading.set(false);
  }

  async getTasks(): Promise<Task[]> {
    await this.simulateDelay(80);
    return this.tasks();
  }

  async createTask(payload: Pick<Task, 'title' | 'description'>): Promise<Task> {
    await this.simulateDelay(80);
    const now = new Date().toISOString();
    const created: Task = {
      id: currentId++,
      title: payload.title,
      description: payload.description,
      status: 'pending',
      createdAt: now,
    };
    this.tasks.update((list) => [...list, created]);
    return created;
  }

  async updateTask(id: number, payload: Partial<Pick<Task, 'title' | 'description' | 'status'>>): Promise<Task> {
    await this.simulateDelay(80);
    const snapshot = this.tasks();
    const existing = snapshot.find((t) => t.id === id);
    if (!existing) {
      throw new Error('Tarefa não encontrada');
    }
    const updated: Task = { ...existing, ...payload };
    this.tasks.update((list) => list.map((t) => (t.id === id ? updated : t)));
    return updated;
  }

  async deleteTask(id: number): Promise<void> {
    await this.simulateDelay(80);
    this.tasks.update((list) => list.filter((t) => t.id !== id));
  }

  async toggleTaskStatus(id: number): Promise<void> {
    const snapshot = this.tasks();
    const existing = snapshot.find((t) => t.id === id);
    if (!existing) return;
    const nextStatus = existing.status === 'completed' ? 'pending' : 'completed';
    await this.updateTask(id, { status: nextStatus });
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

