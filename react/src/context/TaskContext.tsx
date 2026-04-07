import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { taskApi } from '../services/apiService';

export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
}

interface TaskContextValue {
  tasks: Task[];
  loading: boolean;
  createTask: (payload: Pick<Task, 'title' | 'description'>) => Promise<void>;
  updateTask: (id: number, payload: Partial<Pick<Task, 'title' | 'description' | 'status'>>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskStatus: (id: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export const useTasks = (): TaskContextValue => {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error('useTasks deve ser usado dentro de TaskProvider');
  }
  return ctx;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    taskApi
      .getTasks()
      .then((data) => setTasks(data))
      .finally(() => setLoading(false));
  }, []);

  const createTask = async (payload: Pick<Task, 'title' | 'description'>) => {
    const created = await taskApi.createTask(payload);
    setTasks((prev) => [...prev, created]);
  };

  const updateTask = async (id: number, payload: Partial<Pick<Task, 'title' | 'description' | 'status'>>) => {
    const updated = await taskApi.updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id: number) => {
    await taskApi.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTaskStatus = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const nextStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(id, { status: nextStatus });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

