const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getBudgets, createBudget, updateBudget, deleteBudget } = require('../controllers/budgetController');

const router = express.Router();

router.route('/').get(protect, getBudgets).post(protect, createBudget);
router.route('/:id').put(protect, updateBudget).delete(protect, deleteBudget);

module.exports = router;