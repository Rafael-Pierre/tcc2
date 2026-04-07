const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Configuração básica de CORS para permitir os dois front-ends do experimento
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:4200'],
  }),
);
app.use(express.json());

// ----------------------
// Modelo em memória
// ----------------------

let currentId = 1;
let tasks = [];

function cloneTask(task) {
  return { ...task };
}

// ----------------------
// Rotas de tarefas
// ----------------------

// GET /api/tasks - lista todas as tarefas
app.get('/api/tasks', (req, res) => {
  res.json(tasks.map(cloneTask));
});

// POST /api/tasks - cria nova tarefa
// body: { title, description }
app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body || {};

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: 'title e description são obrigatórios.' });
  }

  const now = new Date().toISOString();
  const newTask = {
    id: currentId++,
    title: String(title),
    description: String(description),
    status: 'pending',
    createdAt: now,
  };

  tasks.push(newTask);
  return res.status(201).json(cloneTask(newTask));
});

// PUT /api/tasks/:id - atualiza parcialmente campos da tarefa
// body: { title?, description?, status? }
app.put('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, description, status } = req.body || {};

  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Tarefa não encontrada.' });
  }

  const task = tasks[index];

  if (typeof title === 'string') {
    task.title = title;
  }
  if (typeof description === 'string') {
    task.description = description;
  }
  if (status === 'pending' || status === 'completed') {
    task.status = status;
  }

  tasks[index] = task;
  return res.json(cloneTask(task));
});

// DELETE /api/tasks/:id - remove tarefa
app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Tarefa não encontrada.' });
  }

  tasks.splice(index, 1);
  return res.status(204).send();
});

// ----------------------
// Rota de login fake
// ----------------------

// POST /api/login - autenticação simulada
// body: { email, password }
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  // Nesta fase do experimento, qualquer combinação não vazia é aceita.
  return res.json({
    token: 'fake-token-for-experiment',
    email: String(email),
  });
});

// ----------------------
// Inicialização
// ----------------------

app.listen(PORT, () => {
  console.log(`TaskFlow backend rodando em http://localhost:${PORT}`);
});

