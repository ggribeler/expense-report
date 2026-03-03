import type { CategoryRow } from '../types';
import { toCategory } from '../types';

const BASE = '/api/categories';

export async function fetchCategories() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to fetch categories');
  const rows: CategoryRow[] = await res.json();
  return rows.map(toCategory);
}

export async function fetchCategory(id: string) {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch category');
  const row: CategoryRow = await res.json();
  return toCategory(row);
}

export async function createCategory(data: { name: string; color: string }) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create category');
  }
  const row: CategoryRow = await res.json();
  return toCategory(row);
}

export async function updateCategory(id: string, data: { name: string; color: string }) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update category');
  }
  const row: CategoryRow = await res.json();
  return toCategory(row);
}

export async function deleteCategory(id: string) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete category');
}
