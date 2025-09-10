const express = require('express');
const router = express.Router();
const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const User = require('../models/User');

// Borrow a book
router.post('/borrow', async (req, res) => {
  const { userId, bookId } = req.body;

  try {
    const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    if (!user) return res.status(404).json({ message: 'User  not found' });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.copiesAvailable < 1) return res.status(400).json({ message: 'No copies available' });

    // Create borrow record
    const borrow = new Borrow({ user: userId, book: bookId });
    await borrow.save();

    // Decrement available copies
    book.copiesAvailable -= 1;
    await book.save();

    res.status(201).json({ message: 'Book borrowed successfully', borrow });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Return a book
router.post('/return', async (req, res) => {
  const { borrowId } = req.body;

  try {
    const borrow = await Borrow.findById(borrowId).populate('book');
    if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });
    if (borrow.returnDate) return res.status(400).json({ message: 'Book already returned' });

    borrow.returnDate = new Date();
    await borrow.save();

    // Increment available copies
    const book = await Book.findById(borrow.book._id);
    book.copiesAvailable += 1;
    await book.save();

    res.json({ message: 'Book returned successfully', borrow });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all borrow records
router.get('/', async (req, res) => {
  try {
    const borrows = await Borrow.find().populate('user').populate('book');
    res.json(borrows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;