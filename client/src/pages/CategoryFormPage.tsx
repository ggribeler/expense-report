import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCategories, createCategory, updateCategory } from '../api/categories';
import CategoryForm from '../components/CategoryForm';
import styles from '../styles/CategoryFormPage.module.css';

export default function CategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [initialName, setInitialName] = useState('');
  const [initialColor, setInitialColor] = useState('');
  const [loadingData, setLoadingData] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchCategories().then((cats) => {
        const cat = cats.find((c) => c.id === id);
        if (cat) {
          setInitialName(cat.name);
          setInitialColor(cat.color);
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

  async function handleSubmit(data: { name: string; color: string }) {
    if (isEdit && id) {
      await updateCategory(id, data);
    } else {
      await createCategory(data);
    }
    navigate(-1);
  }

  if (loadingData) return <div className={styles.loading}>Loading...</div>;

  return (
    <div>
      <h1>{isEdit ? 'Edit Category' : 'New Category'}</h1>
      {error && <div className={styles.error}>{error}</div>}
      {!error && (
        <CategoryForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          submitLabel={isEdit ? 'Update' : 'Create'}
          initialName={initialName}
          initialColor={initialColor}
        />
      )}
    </div>
  );
}
