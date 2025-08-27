const Reference = require('../models/Reference');

// Получить справочники с фильтрацией по типу
exports.getReferences = async (req, res) => {
  try {
    const filter = req.query.type ? { type: req.query.type } : {};
    const references = await Reference.find(filter);
    res.json(references);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получить справочник по ID
exports.getReferenceById = async (req, res) => {
  try {
    const reference = await Reference.findById(req.params.id);
    if (!reference) {
      return res.status(404).json({ message: 'Reference not found' });
    }
    res.json(reference);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Создать новый справочник
exports.createReference = async (req, res) => {
  const { type, value, description } = req.body;
  
  // Валидация входных данных
  if (!type || !value) {
    return res.status(400).json({ message: 'Type and value are required' });
  }

  try {
    // Проверка на дублирование
    const existingReference = await Reference.findOne({ type, value });
    if (existingReference) {
      return res.status(409).json({ message: 'Reference with this type and value already exists' });
    }

    const reference = new Reference({ type, value, description });
    await reference.save();
    res.status(201).json(reference);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};

// Обновить справочник
exports.updateReference = async (req, res) => {
  const { type, value, description } = req.body;
  
  try {
    const reference = await Reference.findById(req.params.id);
    if (!reference) {
      return res.status(404).json({ message: 'Reference not found' });
    }

    // Проверка на дублирование при обновлении
    if (type && value) {
      const existingReference = await Reference.findOne({ 
        type, 
        value,
        _id: { $ne: req.params.id } // исключаем текущий документ
      });
      if (existingReference) {
        return res.status(409).json({ message: 'Reference with this type and value already exists' });
      }
    }

    // Обновляем только переданные поля
    if (type !== undefined) reference.type = type;
    if (value !== undefined) reference.value = value;
    if (description !== undefined) reference.description = description;

    await reference.save();
    res.json(reference);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};

// Удалить справочник
exports.deleteReference = async (req, res) => {
  try {
    const reference = await Reference.findById(req.params.id);
    if (!reference) {
      return res.status(404).json({ message: 'Reference not found' });
    }

    await Reference.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reference deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получить уникальные типы справочников
exports.getReferenceTypes = async (req, res) => {
  try {
    const types = await Reference.distinct('type');
    res.json(types);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Массовое удаление справочников по типу
exports.deleteReferencesByType = async (req, res) => {
  const { type } = req.params;
  
  try {
    const result = await Reference.deleteMany({ type });
    res.json({ 
      message: `Successfully deleted ${result.deletedCount} references of type '${type}'`,
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};