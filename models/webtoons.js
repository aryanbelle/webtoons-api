const mongoose = require('mongoose');

const webtoonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  characters: [String], 
}, { timestamps: true });

module.exports = mongoose.model('Webtoon', webtoonSchema);