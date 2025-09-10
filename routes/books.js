// routes/books.js

const express = require('express');
const router = express.Router();
const Book = require('../models/Book'); // Make sure this path is correct

// ➕ Create a book
router.post('/', async (req, res, next) => {
  try {
    const { title, author, publishedDate, pages, genre } = req.body;
    const newBook = new Book({ title, author, publishedDate, pages, genre });
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    next(err);
  }
});

// 📖 Fetch a single book by ID
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
});

// 🔍 Search for books by title (case-insensitive partial match)
router.get('/search/:title', async (req, res, next) => {
  try {
    const title = req.params.title;
    const books = await Book.find({ title: { $regex: title, $options: 'i' } });
    res.json(books);
  } catch (err) {
    next(err);
  }
});

// 📚 Fetch all books with sorting (by author or created date)
// Example: /api/books?sort=author or /api/books?sort=createdAt
router.get('/', async (req, res, next) => {
  try {
    const sortField = req.query.sort;
    let sortOptions = {};

    if (sortField === 'author') {
      sortOptions = { author: 1 }; // ascending by author
    } else if (sortField === 'createdAt') {
      sortOptions = { createdAt: -1 }; // descending by createdAt (newest first)
    }

    const books = await Book.find().sort(sortOptions);
    res.json(books);
  } catch (err) {
    next(err);
  }
});

// ✏️ Update book details by ID
router.put('/:id', async (req, res, next) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.json(updatedBook);
  } catch (err) {
    next(err);
  }
});

// 🗑️ Delete a book by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;