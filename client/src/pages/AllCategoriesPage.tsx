import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Category } from '../types';
import { fetchCategories, deleteCategory } from '../api/categories';
import CategoryListItem from '../components/CategoryListItem';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import EmptyState from '../components/EmptyState';
import styles from '../styles/AllCategoriesPage.module.css';

export default function AllCategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
      setError('');
    } catch {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      loadCategories();
    } catch {
      setError('Failed to delete category');
      setDeleteTarget(null);
    }
  }

  return (
    <div className={styles.page}>
      <h1>
        Categories
        <button className={styles.addBtn} onClick={() => navigate('/categories/new')}>
          Add Category
        </button>
      </h1>

      {error && <div className={styles.error}>{error}</div>}
      {loading && <div className={styles.loading}>Loading...</div>}

      {!loading && categories.length === 0 && (
        <EmptyState title="No categories yet" message="Create a category to organize your expenses." />
      )}

      <div className={styles.list}>
        {categories.map((cat) => (
          <CategoryListItem
            key={cat.id}
            category={cat}
            onDelete={setDeleteTarget}
          />
        ))}
      </div>

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Delete Category"
          message={
            deleteTarget.expense_count
              ? `"${deleteTarget.name}" has ${deleteTarget.expense_count} expense(s). They will become uncategorized.`
              : `Are you sure you want to delete "${deleteTarget.name}"?`
          }
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
