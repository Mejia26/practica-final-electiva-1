const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('app/public'));

// Conexión a Base de Datos (en memoria para esta práctica)
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY, title TEXT)");
});

// Rutas
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

// Endpoint de monitoreo (Healthcheck)
app.get('/health', (req, res) => {
  res.status(200).send('OK - El sistema está vivo');
});

app.listen(port, () => {
  console.log(`App corriendo en http://localhost:${port}`);
});