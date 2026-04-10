const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3000;

// Middleware de Logs
app.use(morgan('combined')); 
app.use(express.json());
app.use(express.static('app/public'));

const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY, title TEXT)");
});

// --- SECCIÓN DE MONITOREO Y VERSIÓN ---

// 1. NUEVO: Endpoint para la versión dinámica
app.get('/api/version', (req, res) => {
  // Leemos el SHA de Git que Render inyecta, o un fallback para local
  const gitSha = process.env.RENDER_GIT_COMMIT || 'Dev-Local';
  // Tomamos solo los primeros 7 caracteres para que sea más legible
  const shortSha = gitSha.substring(0, 7);
  res.json({ version: `v1.0.0-${shortSha}` });
});

// 2. Healthcheck (ya lo tenías, modifícalo un poco)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'UP', 
        timestamp: new Date(),
        // Agregamos la versión también al healthcheck, es buena práctica
        version: process.env.RENDER_GIT_COMMIT ? process.env.RENDER_GIT_COMMIT.substring(0, 7) : 'Local'
    });
});

// 3. Métricas
app.get('/metrics', (req, res) => {
  const metrics = { uptime: process.uptime(), memoryUsage: process.memoryUsage(), platform: process.platform, timestamp: Date.now() };
  res.json(metrics);
});

// --- RUTAS DE LA APP (tasks) ---
app.get('/api/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => { res.json(rows); });
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  db.run("INSERT INTO tasks (title) VALUES (?)", [title], function(err) { res.status(201).json({ id: this.lastID, title }); });
});

app.listen(port, () => { console.log(`App corriendo en http://localhost:${port}`); });