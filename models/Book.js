const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  isbn: { type: String, unique: true },
  copiesAvailable: { type: Number, default: 1 },
  totalCopies: { type: Number, default: 1 }
});

module.exports = mongoose.model('Book', BookSchema);