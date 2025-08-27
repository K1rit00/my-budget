// dreamController.js
const Dream = require('../models/Dream');

exports.getDreams = async (req, res) => {
  try {
    const dreams = await Dream.find({ userId: req.user.id });
    res.json(dreams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDream = async (req, res) => {
  try {
    const dream = new Dream({ ...req.body, userId: req.user.id });
    await dream.save();
    res.status(201).json(dream);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateDream = async (req, res) => {
  try {
    const dream = await Dream.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dream) return res.status(404).json({ message: 'Dream not found' });
    res.json(dream);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteDream = async (req, res) => {
  try {
    await Dream.findByIdAndDelete(req.params.id);
    res.json({ message: 'Dream deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};