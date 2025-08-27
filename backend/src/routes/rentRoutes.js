// rentRoutes.js
const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getRents, createRent, updateRent, deleteRent } = require('../controllers/rentController');

const router = express.Router();

router.route('/').get(protect, getRents).post(protect, createRent);
router.route('/:id').put(protect, updateRent).delete(protect, deleteRent);

module.exports = router;