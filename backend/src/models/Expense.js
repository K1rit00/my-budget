const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., food, transport
  date: { type: Date, required: true },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);