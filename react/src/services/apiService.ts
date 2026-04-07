import type { Task } from '../context/TaskContext';

// Serviço de API preparado para futura integração REST real.
// Por enquanto, funciona apenas com dados mockados em memória.

let currentId = 1;
let mockTasks: Task[] = [];

const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const taskApi = {
  baseUrl: '/api/tasks',

  async getTasks(): Promise<Task[]> {
    // Exemplo de futura implementação:
    // const response = await fetch(this.baseUrl);
    // return response.json();
    await simulateDelay(100);
    return [...mockTasks];
  },

  async createTask(payload: Pick<Task, 'title' | 'description'>): Promise<Task> {
    await simulateDelay(100);
    const now = new Date().toISOString();
    const created: Task = {
      id: currentId++,
      title: payload.title,
      description: payload.description,
      status: 'pending',
      createdAt: now,
    };
    mockTasks = [...mockTasks, created];
    return created;
  },

  async updateTask(id: number, payload: Partial<Pick<Task, 'title' | 'description' | 'status'>>): Promise<Task> {
    await simulateDelay(100);
    const existing = mockTasks.find((t) => t.id === id);
    if (!existing) {
      throw new Error('Tarefa não encontrada');
    }
    const updated: Task = { ...existing, ...payload };
    mockTasks = mockTasks.map((t) => (t.id === id ? updated : t));
    return updated;
  },

  async deleteTask(id: number): Promise<void> {
    await simulateDelay(100);
    mockTasks = mockTasks.filter((t) => t.id !== id);
  },
};

export const authApi = {
  baseUrl: '/api/login',

  async login(email: string, password: string): Promise<boolean> {
    await simulateDelay(100);
    // Futura integração:
    // const response = await fetch(this.baseUrl, { method: 'POST', body: JSON.stringify({ email, password }) });
    // return response.ok;
    if (!email.trim() || !password.trim()) {
      return false;
    }
    return true;
  },
};

