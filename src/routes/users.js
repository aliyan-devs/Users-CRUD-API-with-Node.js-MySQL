const express = require('express');
const pool = require('../database');
const asyncHandler = require('../asyncHandler');
const { validateId, validateUser } = require('../validation');

const router = express.Router();

const USER_COLUMNS = 'id, name, email, age, created_at AS createdAt, updated_at AS updatedAt';

function toUser(row) {
  if (!row) return null;
  return {
    ...row,
    age: row.age === null ? null : Number(row.age)
  };
}

router.post('/', asyncHandler(async (req, res) => {
  const user = validateUser(req.body);
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
    [user.name, user.email, user.age ?? null]
  );
  const [rows] = await pool.execute(
    `SELECT ${USER_COLUMNS} FROM users WHERE id = ?`,
    [result.insertId]
  );
  res.status(201).json({ data: toUser(rows[0]) });
}));

router.get('/', asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT ${USER_COLUMNS} FROM users ORDER BY id`
  );
  res.json({ data: rows.map(toUser) });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const id = validateId(req.params.id);
  const [rows] = await pool.execute(
    `SELECT ${USER_COLUMNS} FROM users WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: 'User not found.' });
  }
  return res.json({ data: toUser(rows[0]) });
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const id = validateId(req.params.id);
  const user = validateUser(req.body, { partial: true });
  const fields = Object.keys(user);
  const assignments = fields.map((field) => `${field} = ?`).join(', ');
  const values = fields.map((field) => user[field]);
  const [result] = await pool.execute(
    `UPDATE users SET ${assignments} WHERE id = ?`,
    [...values, id]
  );

  if (result.affectedRows === 0) {
    const [rows] = await pool.execute('SELECT id FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
  }

  const [rows] = await pool.execute(
    `SELECT ${USER_COLUMNS} FROM users WHERE id = ?`,
    [id]
  );
  return res.json({ data: toUser(rows[0]) });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const id = validateId(req.params.id);
  const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'User not found.' });
  }
  return res.status(204).end();
}));

module.exports = router;
