import { NavLink } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/expenses" className={styles.logo}>
        Expense Tracker
      </NavLink>
      <NavLink
        to="/expenses"
        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
      >
        Expenses
      </NavLink>
      <NavLink
        to="/categories"
        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
      >
        Categories
      </NavLink>
    </nav>
  );
}
