// Схемы Mongoose 
const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  totalIncome: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);