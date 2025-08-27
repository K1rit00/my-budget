// referenceRoutes.js
const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getReferences, createReference, updateReference, deleteReference } = require('../controllers/referenceController');

const router = express.Router();

router.route('/').get(protect, getReferences).post(protect, createReference);
router.route('/:id').put(protect, updateReference).delete(protect, deleteReference);

module.exports = router;