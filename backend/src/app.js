const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const planRoutes = require('./routes/planRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const rentRoutes = require('./routes/rentRoutes');
const dreamRoutes = require('./routes/dreamRoutes');
const referenceRoutes = require('./routes/referenceRoutes');

const app = express();

connectDB();

app.use(cors({ origin: 'http://localhost:5173' })); // Для фронтенда Vite
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/rents', rentRoutes);
app.use('/api/dreams', dreamRoutes);
app.use('/api/references', referenceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));