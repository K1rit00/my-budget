// paymentRoutes.js
const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getPayments, createPayment, updatePayment, deletePayment } = require('../controllers/paymentController');

const router = express.Router();

router.route('/').get(protect, getPayments).post(protect, createPayment);
router.route('/:id').put(protect, updatePayment).delete(protect, deletePayment);

module.exports = router;