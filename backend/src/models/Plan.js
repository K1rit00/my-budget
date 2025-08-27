const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  plannedIncome: { type: Number, default: 0 },
  plannedExpenses: { type: Number, default: 0 },
  goals: [{ type: String }], // e.g., save 1000
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);