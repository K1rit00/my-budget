// incomeRoutes.js
const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getIncomes, createIncome, updateIncome, deleteIncome } = require('../controllers/incomeController');

const router = express.Router();

router.route('/').get(protect, getIncomes).post(protect, createIncome);
router.route('/:id').put(protect, updateIncome).delete(protect, deleteIncome);

module.exports = router;