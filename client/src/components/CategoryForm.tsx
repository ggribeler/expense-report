import { useState } from 'react';
import { PRESET_COLORS } from '../utils/constants';
import styles from '../styles/CategoryForm.module.css';

interface CategoryFormProps {
  onSubmit: (data: { name: string; color: string }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  initialName?: string;
  initialColor?: string;
}

export default function CategoryForm({
  onSubmit,
  onCancel,
  submitLabel = 'Create',
  initialName = '',
  initialColor = PRESET_COLORS[0],
}: CategoryFormProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({ name: name.trim(), color });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error && <div className={styles.error}>{error}</div>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="categoryName">Name</label>
          <input
            id="categoryName"
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
            {loading ? 'Saving...' : submitLabel}
          </button>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
