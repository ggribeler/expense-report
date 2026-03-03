import type { ExpenseRow } from '../types';
import { toExpense } from '../types';

const BASE = '/api/expenses';

export interface ExpenseFilters {
  description?: string;
  categoryId?: string;
  dateFrom?: number;
  dateTo?: number;
}

export async function fetchExpenses(filters?: ExpenseFilters) {
  const params = new URLSearchParams();
  if (filters?.description) params.set('description', filters.description);
  if (filters?.categoryId) params.set('categoryId', filters.categoryId);
  if (filters?.dateFrom) params.set('dateFrom', String(filters.dateFrom));
  if (filters?.dateTo) params.set('dateTo', String(filters.dateTo));

  const query = params.toString();
  const res = await fetch(`${BASE}${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch expenses');
  const rows: ExpenseRow[] = await res.json();
  return rows.map(toExpense);
}

export async function fetchExpense(id: string) {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch expense');
  const row: ExpenseRow = await res.json();
  return toExpense(row);
}

export async function createExpense(data: {
  value: number;
  date: number;
  description: string;
  categoryId?: string | null;
}) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create expense');
  }
  const row: ExpenseRow = await res.json();
  return toExpense(row);
}

export async function updateExpense(id: string, data: {
  value: number;
  date: number;
  description: string;
  categoryId?: string | null;
}) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update expense');
  }
  const row: ExpenseRow = await res.json();
  return toExpense(row);
}

export async function deleteExpense(id: string) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete expense');
}
