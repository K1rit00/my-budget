// incomeController.js
const Income = require('../models/Income');

exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user.id });
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createIncome = async (req, res) => {
  try {
    const income = new Income({ ...req.body, userId: req.user.id });
    await income.save();
    res.status(201).json(income);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!income) return res.status(404).json({ message: 'Income not found' });
    res.json(income);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: 'Income deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};