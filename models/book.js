/*
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedYear: { type: Number },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
*/

// models/book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Book price should be non-negative
  },
  stock: {
    type: Number,
    required: true,
    min: 0, // Stock should be non-negative
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;





