const mongoose = require('mongoose');

const referenceSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'expense_category', 'income_source'
  value: { type: String, required: true }, // e.g., 'food', 'salary'
  description: { type: String },
}, { timestamps: true });

// Это глобальные справочники, не привязанные к пользователю
module.exports = mongoose.model('Reference', referenceSchema);