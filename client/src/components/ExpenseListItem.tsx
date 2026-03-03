import { useNavigate } from 'react-router-dom';
import type { Expense } from '../types';
import { formatDate } from '../utils/dateHelpers';
import { formatCurrency } from '../utils/constants';
import styles from '../styles/ExpenseListItem.module.css';

interface Props {
  expense: Expense;
  onDelete: (expense: Expense) => void;
}

export default function ExpenseListItem({ expense, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <div className={styles.item}>
      <div className={styles.value}>{formatCurrency(expense.value)}</div>
      <div className={styles.details}>
        <div className={styles.description}>{expense.description}</div>
        <div className={styles.meta}>
          <span>{formatDate(expense.date)}</span>
          {expense.category_name && (
            <>
              <span
                className={styles.categoryDot}
                style={{ backgroundColor: expense.category_color || '#ccc' }}
              />
              <span>{expense.category_name}</span>
            </>
          )}
          {!expense.category_name && expense.categoryId === null && (
            <span style={{ fontStyle: 'italic' }}>Uncategorized</span>
          )}
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => navigate(`/expenses/${expense.id}/edit`)}>
          Edit
        </button>
        <button className={styles.deleteBtn} onClick={() => onDelete(expense)}>
          Delete
        </button>
      </div>
    </div>
  );
}
