import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCategories, createCategory, updateCategory } from '../api/categories';
import { PRESET_COLORS } from '../utils/constants';
import styles from '../styles/CategoryFormPage.module.css';

export default function CategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchCategories().then((cats) => {
        const cat = cats.find((c) => c.id === id);
        if (cat) {
          setName(cat.name);
          setColor(cat.color);
        } else {
          setError('Category not found');
        }
        setLoadingData(false);
      }).catch(() => {
        setError('Failed to load category');
        setLoadingData(false);
      });
    }
  }, [id, isEdit]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEdit && id) {
        await updateCategory(id, { name: name.trim(), color });
      } else {
        await createCategory({ name: name.trim(), color });
      }
      navigate('/categories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) return <div className={styles.loading}>Loading...</div>;

  return (
    <div>
      <h1>{isEdit ? 'Edit Category' : 'New Category'}</h1>
      {error && <div className={styles.error}>{error}</div>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Groceries"
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label>Color</label>
          <div className={styles.colorSwatches}>
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`${styles.swatch} ${color === c ? styles.swatchSelected : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate('/categories')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
