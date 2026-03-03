import express from 'express';
import cors from 'cors';
import categoriesRouter from './routes/categories.js';
import expensesRouter from './routes/expenses.js';
import './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/categories', categoriesRouter);
app.use('/api/expenses', expensesRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
