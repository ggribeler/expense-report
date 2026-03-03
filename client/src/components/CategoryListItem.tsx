import { useNavigate } from 'react-router-dom';
import type { Category } from '../types';
import styles from '../styles/CategoryListItem.module.css';

interface Props {
  category: Category;
  onDelete: (category: Category) => void;
}

export default function CategoryListItem({ category, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <div className={styles.item}>
      <div className={styles.colorSwatch} style={{ backgroundColor: category.color }} />
      <div className={styles.info}>
        <div className={styles.name}>{category.name}</div>
        <div className={styles.count}>
          {category.expense_count ?? 0} expense{category.expense_count !== 1 ? 's' : ''}
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => navigate(`/categories/${category.id}/edit`)}>
          Edit
        </button>
        <button className={styles.deleteBtn} onClick={() => onDelete(category)}>
          Delete
        </button>
      </div>
    </div>
  );
}
