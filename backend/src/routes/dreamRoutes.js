// dreamRoutes.js
const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getDreams, createDream, updateDream, deleteDream } = require('../controllers/dreamController');

const router = express.Router();

router.route('/').get(protect, getDreams).post(protect, createDream);
router.route('/:id').put(protect, updateDream).delete(protect, deleteDream);

module.exports = router;