// rentController.js
const Rent = require('../models/Rent');

exports.getRents = async (req, res) => {
  try {
    const rents = await Rent.find({ userId: req.user.id });
    res.json(rents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRent = async (req, res) => {
  try {
    const rent = new Rent({ ...req.body, userId: req.user.id });
    await rent.save();
    res.status(201).json(rent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateRent = async (req, res) => {
  try {
    const rent = await Rent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rent) return res.status(404).json({ message: 'Rent not found' });
    res.json(rent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteRent = async (req, res) => {
  try {
    await Rent.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rent deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};