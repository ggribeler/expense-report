import { Router } from 'express';
import db from '../database.js';
import { generateUUID } from '../utils/uuid.js';

const router = Router();

// GET /api/expenses - list expenses with optional filters
router.get('/', (req, res) => {
  const { description, categoryId, dateFrom, dateTo } = req.query;

  let sql = `
    SELECT e.*, c.name AS category_name, c.color AS category_color
    FROM expenses e
    LEFT JOIN categories c ON e.category_id = c.id
    WHERE 1=1
  `;
  const params: unknown[] = [];

  if (description && typeof description === 'string') {
    sql += ' AND e.description LIKE ?';
    params.push(`%${description}%`);
  }

  if (categoryId && typeof categoryId === 'string') {
    if (categoryId === 'uncategorized') {
      sql += ' AND e.category_id IS NULL';
    } else {
      sql += ' AND e.category_id = ?';
      params.push(categoryId);
    }
  }

  if (dateFrom && typeof dateFrom === 'string') {
    sql += ' AND e.date >= ?';
    params.push(Number(dateFrom));
  }

  if (dateTo && typeof dateTo === 'string') {
    sql += ' AND e.date <= ?';
    params.push(Number(dateTo));
  }

  sql += ' ORDER BY e.date DESC';

  const expenses = db.prepare(sql).all(...params);
  res.json(expenses);
});

// POST /api/expenses - create an expense
router.post('/', (req, res) => {
  const { value, date, description, categoryId } = req.body;

  if (!value || !date || !description) {
    res.status(400).json({ error: 'Value, date, and description are required' });
    return;
  }

  if (typeof value !== 'number' || value <= 0) {
    res.status(400).json({ error: 'Value must be a positive number' });
    return;
  }

  const id = generateUUID();
  const now = Date.now();

  db.prepare(`
    INSERT INTO expenses (id, value, date, description, category_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, value, date, description.trim(), categoryId || null, now, now);

  const expense = db.prepare(`
    SELECT e.*, c.name AS category_name, c.color AS category_color
    FROM expenses e
    LEFT JOIN categories c ON e.category_id = c.id
    WHERE e.id = ?
  `).get(id);
  res.status(201).json(expense);
});

// PUT /api/expenses/:id - update an expense
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { value, date, description, categoryId } = req.body;

  const existing = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
  if (!existing) {
    res.status(404).json({ error: 'Expense not found' });
    return;
  }

  if (typeof value !== 'number' || value <= 0) {
    res.status(400).json({ error: 'Value must be a positive number' });
    return;
  }

  const now = Date.now();
  db.prepare(`
    UPDATE expenses SET value = ?, date = ?, description = ?, category_id = ?, updated_at = ?
    WHERE id = ?
  `).run(value, date, description?.trim(), categoryId || null, now, id);

  const expense = db.prepare(`
    SELECT e.*, c.name AS category_name, c.color AS category_color
    FROM expenses e
    LEFT JOIN categories c ON e.category_id = c.id
    WHERE e.id = ?
  `).get(id);
  res.json(expense);
});

// DELETE /api/expenses/:id - delete an expense
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
  if (!existing) {
    res.status(404).json({ error: 'Expense not found' });
    return;
  }

  db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
  res.status(204).send();
});

export default router;
