// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Replace with your actual MongoDB connection string and database name
const mongoURI = 'mongodb+srv://AJIN:SWfCGdGJ3TYL3ttA@cluster0.ur52056.mongodb.net/yourDatabaseName?retryWrites=true&w=majority';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const booksRouter = require('./routes/books');
const usersRouter = require('./routes/users');
const borrowRouter = require('./routes/borrow');

// Use routes
app.use('/api/books', booksRouter);
app.use('/api/users', usersRouter);
app.use('/api/borrow', borrowRouter);

// Root route
app.get('/', (req, res) => {
  res.send('Library Management Backend API');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//ajin