import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AllExpensesPage from './pages/AllExpensesPage';
import ExpenseFormPage from './pages/ExpenseFormPage';
import AllCategoriesPage from './pages/AllCategoriesPage';
import CategoryFormPage from './pages/CategoryFormPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '1.5rem 1rem' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/expenses" replace />} />
          <Route path="/expenses" element={<AllExpensesPage />} />
          <Route path="/expenses/new" element={<ExpenseFormPage />} />
          <Route path="/expenses/:id/edit" element={<ExpenseFormPage />} />
          <Route path="/categories" element={<AllCategoriesPage />} />
          <Route path="/categories/new" element={<CategoryFormPage />} />
          <Route path="/categories/:id/edit" element={<CategoryFormPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
