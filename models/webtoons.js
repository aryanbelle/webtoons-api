// models/webtoons.js
const mongoose = require('mongoose');

const webtoonSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: String,
  characters: [{ type: String, index: true }], 
}, { timestamps: true });

webtoonSchema.index({ title: 1, characters: 1 });

module.exports = mongoose.model('Webtoon', webtoonSchema);