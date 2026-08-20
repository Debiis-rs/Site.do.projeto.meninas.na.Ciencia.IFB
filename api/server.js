const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/usuarios', async (req, res) => {
  const { nome, email, whatsapp } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, whatsapp) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, whatsapp]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ erro: 'Email já cadastrado' });
    }
    res.status(500).json({ erro: err.message });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));