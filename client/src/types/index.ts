export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export interface Category {
  id: UUID;
  name: string;
  color: string;
  createdAt: number;
  updatedAt: number;
  expense_count?: number;
}

export interface Expense {
  id: UUID;
  value: number;
  date: number;
  description: string;
  categoryId: UUID | null;
  createdAt: number;
  updatedAt: number;
  category_name?: string | null;
  category_color?: string | null;
}

// API response uses snake_case from SQLite
export interface CategoryRow {
  id: string;
  name: string;
  color: string;
  created_at: number;
  updated_at: number;
  expense_count?: number;
}

export interface ExpenseRow {
  id: string;
  value: number;
  date: number;
  description: string;
  category_id: string | null;
  created_at: number;
  updated_at: number;
  category_name?: string | null;
  category_color?: string | null;
}

export function toCategory(row: CategoryRow): Category {
  return {
    id: row.id as UUID,
    name: row.name,
    color: row.color,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expense_count: row.expense_count,
  };
}

export function toExpense(row: ExpenseRow): Expense {
  return {
    id: row.id as UUID,
    value: row.value,
    date: row.date,
    description: row.description,
    categoryId: row.category_id as UUID | null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category_name: row.category_name,
    category_color: row.category_color,
  };
}
