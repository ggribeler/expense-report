import { Router } from 'express';
import db from '../database.js';
import { generateUUID } from '../utils/uuid.js';

const router = Router();

// GET /api/categories - list all categories
router.get('/', (_req, res) => {
  const categories = db.prepare(`
    SELECT c.*, (SELECT COUNT(*) FROM expenses WHERE category_id = c.id) AS expense_count
    FROM categories c
    ORDER BY c.name
  `).all();
  res.json(categories);
});

// POST /api/categories - create a category
router.post('/', (req, res) => {
  const { name, color } = req.body;
  if (!name || !color) {
    res.status(400).json({ error: 'Name and color are required' });
    return;
  }

  const existing = db.prepare('SELECT id FROM categories WHERE name = ?').get(name);
  if (existing) {
    res.status(409).json({ error: 'A category with this name already exists' });
    return;
  }

  const id = generateUUID();
  const now = Date.now();

  db.prepare(`
    INSERT INTO categories (id, name, color, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, name.trim(), color, now, now);

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  res.status(201).json(category);
});

// PUT /api/categories/:id - update a category
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;

  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  if (!existing) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  const duplicate = db.prepare('SELECT id FROM categories WHERE name = ? AND id != ?').get(name, id);
  if (duplicate) {
    res.status(409).json({ error: 'A category with this name already exists' });
    return;
  }

  const now = Date.now();
  db.prepare(`
    UPDATE categories SET name = ?, color = ?, updated_at = ? WHERE id = ?
  `).run(name?.trim(), color, now, id);

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  res.json(category);
});

// DELETE /api/categories/:id - delete a category (orphans expenses)
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  if (!existing) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  res.status(204).send();
});

export default router;
