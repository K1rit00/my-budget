const mongoose = require('mongoose');

const dreamSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, // e.g., "Buy car"
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  deadline: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Dream', dreamSchema);