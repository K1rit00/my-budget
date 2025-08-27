// planRoutes.js
const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getPlans, createPlan, updatePlan, deletePlan } = require('../controllers/planController');

const router = express.Router();

router.route('/').get(protect, getPlans).post(protect, createPlan);
router.route('/:id').put(protect, updatePlan).delete(protect, deletePlan);

module.exports = router;