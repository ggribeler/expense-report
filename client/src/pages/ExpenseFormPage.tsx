import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Category } from '../types';
import { fetchCategories } from '../api/categories';
import { fetchExpenses, createExpense, updateExpense } from '../api/expenses';
import { toDateInputValue, fromDateInputValue } from '../utils/dateHelpers';
import styles from '../styles/ExpenseFormPage.module.css';

export default function ExpenseFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [value, setValue] = useState('');
  const [date, setDate] = useState(toDateInputValue(Date.now()));
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      fetchExpenses().then((expenses) => {
        const exp = expenses.find((e) => e.id === id);
        if (exp) {
          setValue(String(exp.value));
          setDate(toDateInputValue(exp.date));
          setDescription(exp.description);
          setCategoryId(exp.categoryId || '');
        } else {
          setError('Expense not found');
        }
        setLoadingData(false);
      }).catch(() => {
        setError('Failed to load expense');
        setLoadingData(false);
      });
    }
  }, [id, isEdit]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numValue = parseFloat(value);

    if (!value || isNaN(numValue) || numValue <= 0) {
      setError('Value must be a positive number');
      return;
    }
    if (!date) {
      setError('Date is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      value: numValue,
      date: fromDateInputValue(date),
      description: description.trim(),
      categoryId: categoryId || null,
    };

    try {
      if (isEdit && id) {
        await updateExpense(id, payload);
      } else {
        await createExpense(payload);
      }
      navigate('/expenses');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) return <div className={styles.loading}>Loading...</div>;

  return (
    <div>
      <h1>{isEdit ? 'Edit Expense' : 'New Expense'}</h1>
      {error && <div className={styles.error}>{error}</div>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="value">Amount ($)</label>
          <input
            id="value"
            type="number"
            step="0.01"
            min="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0.00"
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Weekly groceries"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate('/expenses')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
