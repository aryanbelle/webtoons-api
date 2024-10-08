const express = require('express');
const router = express.Router();
const Webtoon = require('../models/webtoons');
const { authenticateToken } = require('../middleware/auth');

// GET all webtoons
router.get('/', async (req, res) => {
  try {
    const webtoons = await Webtoon.find();
    res.json(webtoons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific webtoon by ID
router.get('/:id', async (req, res) => {
  try {
    const webtoon = await Webtoon.findById(req.params.id);
    if (!webtoon) return res.status(404).json({ message: 'Webtoon not found' });
    res.json(webtoon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new webtoon
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, characters } = req.body;
  const webtoon = new Webtoon({ title, description, characters });
  try {
    const newWebtoon = await webtoon.save();
    res.status(201).json(newWebtoon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a webtoon by ID
// DELETE a webtoon by ID (requires JWT authentication)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const webtoon = await Webtoon.findByIdAndDelete(req.params.id);
    if (!webtoon) return res.status(404).json({ message: 'Webtoon not found' });
    
    res.json({ message: 'Webtoon deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;