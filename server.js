const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const morgan = require('morgan');
const logger = require('./logger');

const app = express();
const db = new sqlite3.Database(':memory:'); // Base de datos en memoria para el ejemplo

app.use(express.json());
app.use(express.static('public'));

// Middleware de métricas básicas (Tiempo de respuesta)
app.use(morgan('tiny', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Inicializar DB
db.serialize(() => {
  db.run("CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT)");
});

// Rutas API
app.get('/api/items', (req, res) => {
  db.all("SELECT * FROM items", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/items', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Nombre requerido" });
  
  db.run("INSERT INTO items (name) VALUES (?)", [name], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name });
  });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => logger.info(`Servidor corriendo en http://localhost:${PORT}`));
}

module.exports = app; // Exportar para pruebas