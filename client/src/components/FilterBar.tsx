import type { Category } from '../types';
import styles from '../styles/FilterBar.module.css';

interface Filters {
  description: string;
  categoryId: string;
  dateFrom: string;
  dateTo: string;
}

interface Props {
  filters: Filters;
  categories: Category[];
  onChange: (filters: Filters) => void;
  onClear: () => void;
}

export default function FilterBar({ filters, categories, onChange, onClear }: Props) {
  function update(key: keyof Filters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  const hasFilters = filters.description || filters.categoryId || filters.dateFrom || filters.dateTo;

  return (
    <div className={styles.filterBar}>
      <div className={styles.field}>
        <label>Search</label>
        <input
          type="text"
          placeholder="Description..."
          value={filters.description}
          onChange={(e) => update('description', e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label>Category</label>
        <select value={filters.categoryId} onChange={(e) => update('categoryId', e.target.value)}>
          <option value="">All</option>
          <option value="uncategorized">Uncategorized</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label>From</label>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => update('dateFrom', e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label>To</label>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => update('dateTo', e.target.value)}
        />
      </div>
      {hasFilters && (
        <button className={styles.clearBtn} onClick={onClear}>Clear</button>
      )}
    </div>
  );
}
