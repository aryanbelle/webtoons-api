const express = require('express');
const router = express.Router();
const Webtoon = require('../models/webtoons');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});

router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const webtoons = await Webtoon.find()
      .skip((page - 1) * limit) 
      .limit(limit)
      .select('title description');
    res.json(webtoons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const webtoon = await Webtoon.findById(req.params.id);
    if (!webtoon) return res.status(404).json({ message: 'Webtoon not found' });
    res.json(webtoon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post(
  '/',
  authenticateToken,
  [
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('description').isString().optional(),
    body('characters').isArray().withMessage('Characters must be an array'),
    body('characters.*').isString().withMessage('Each character must be a string'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, characters } = req.body;
    const webtoon = new Webtoon({ title, description, characters });
    
    try {
      const newWebtoon = await webtoon.save();
      res.status(201).json(newWebtoon);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

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