const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./produtos.db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve arquivos da raiz

// Inicializa o banco
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    foto TEXT,
    link TEXT,
    precoAntigo TEXT,
    precoNovo TEXT,
    desconto TEXT,
    cupom TEXT,
    loja TEXT
  )`);
});

// Rotas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Home.html'));
});

app.get('/criador', (req, res) => {
  res.sendFile(path.join(__dirname, 'criador.html'));
});

app.get('/produtos', (req, res) => {
  db.all('SELECT nome, foto, link, precoAntigo, precoNovo, desconto, cupom, loja FROM produtos', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/produtos', (req, res) => {
  const p = req.body;
  db.run(
    `INSERT INTO produtos (nome, foto, link, precoAntigo, precoNovo, desconto, cupom, loja) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [p.nome, p.foto, p.link, p.precoAntigo, p.precoNovo, p.desconto, p.cupom, p.loja],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ status: 'ok', produto: p });
    }
  );
});

// Inicia o servidor
const PORT = process.env.PORT || 80;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});