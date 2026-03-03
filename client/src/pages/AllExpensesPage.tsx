import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Category, Expense } from '../types';
import { fetchExpenses, deleteExpense, type ExpenseFilters } from '../api/expenses';
import { fetchCategories } from '../api/categories';
import { fromDateInputValue, endOfDay } from '../utils/dateHelpers';
import FilterBar from '../components/FilterBar';
import ExpenseListItem from '../components/ExpenseListItem';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import EmptyState from '../components/EmptyState';
import styles from '../styles/AllExpensesPage.module.css';

const EMPTY_FILTERS = { description: '', categoryId: '', dateFrom: '', dateTo: '' };

export default function AllExpensesPage() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);

  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const apiFilters: ExpenseFilters = {};
      if (filters.description) apiFilters.description = filters.description;
      if (filters.categoryId) apiFilters.categoryId = filters.categoryId;
      if (filters.dateFrom) apiFilters.dateFrom = fromDateInputValue(filters.dateFrom);
      if (filters.dateTo) apiFilters.dateTo = endOfDay(fromDateInputValue(filters.dateTo));
      const data = await fetchExpenses(apiFilters);
      setExpenses(data);
      setError('');
    } catch {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteExpense(deleteTarget.id);
      setDeleteTarget(null);
      loadExpenses();
    } catch {
      setError('Failed to delete expense');
      setDeleteTarget(null);
    }
  }

  return (
    <div className={styles.page}>
      <h1>
        Expenses
        <button className={styles.addBtn} onClick={() => navigate('/expenses/new')}>
          Add Expense
        </button>
      </h1>

      <FilterBar
        filters={filters}
        categories={categories}
        onChange={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />

      {error && <div className={styles.error}>{error}</div>}
      {loading && <div className={styles.loading}>Loading...</div>}

      {!loading && expenses.length === 0 && (
        <EmptyState
          title="No expenses found"
          message={
            filters.description || filters.categoryId || filters.dateFrom || filters.dateTo
              ? 'Try adjusting your filters.'
              : 'Add your first expense to get started.'
          }
        />
      )}

      <div className={styles.list}>
        {expenses.map((exp) => (
          <ExpenseListItem key={exp.id} expense={exp} onDelete={setDeleteTarget} />
        ))}
      </div>

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Delete Expense"
          message={`Are you sure you want to delete "${deleteTarget.description}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
