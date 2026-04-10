const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const morgan = require('morgan'); // <-- 1. Importar Morgan para Logs
const app = express();
const port = process.env.PORT || 3000;

// Middleware de Logs: Registra cada petición en la consola
app.use(morgan('combined')); 

app.use(express.json());
app.use(express.static('app/public'));

const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY, title TEXT)");
});

// --- SECCIÓN DE MONITOREO ---

// 2. Endpoint de Métricas Básicas
app.get('/metrics', (req, res) => {
  const metrics = {
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    platform: process.platform,
    timestamp: Date.now()
  };
  res.json(metrics);
});

// 3. Endpoint de Salud (Ya lo tenías, es parte del monitoreo)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// --- RUTAS DE LA APP ---
app.get('/api/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    res.json(rows);
  });
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  db.run("INSERT INTO tasks (title) VALUES (?)", [title], function(err) {
    res.status(201).json({ id: this.lastID, title });
  });
});

app.listen(port, () => {
  console.log(`App corriendo en http://localhost:${port}`);
});