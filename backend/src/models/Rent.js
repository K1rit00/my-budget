const mongoose = require('mongoose');

const rentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paidDate: { type: Date },
  status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
}, { timestamps: true });

module.exports = mongoose.model('Rent', rentSchema);