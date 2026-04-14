const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || 'dev_secret';

app.use(cors());
app.use(express.json());

function protect(req, res, next) {
  const head = req.headers['authorization'];
  const token = head && head.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate' });
    req.userId = decoded.id;
    next();
  });
}

app.get('/api/localization/:lang', async (req, res) => {
  try {
    const { lang } = req.params;
    const { rows } = await db.query('SELECT key, en_text, sv_text FROM translations');
    const map = {};
    rows.forEach(item => {
      map[item.key] = lang === 'sv' ? item.sv_text : item.en_text;
    });
    res.json(map);
  } catch (e) {
    console.error(e);
    res.status(500).send('Server Error');
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '12h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/products', protect, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.patch('/api/products/:id', protect, async (req, res) => {
  const { id } = req.params;
  const { field, value } = req.body;
  const allowed = ['article_no', 'description', 'in_price', 'out_price', 'unit', 'stock'];
  if (!allowed.includes(field)) {
    return res.status(400).json({ message: 'Field not editable' });
  }
  try {
    const { rows } = await db.query(
      `UPDATE products SET ${field} = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [value, id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
