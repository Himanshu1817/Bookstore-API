
// controllers/bookController.js
const Joi = require('joi');
const Book = require('../models/book');

const BookController = {
  getAllBooks: async (req, res) => {
    // Implement logic to retrieve paginated list of books with filtering options like genre and availability (in stock)
    // You can use query parameters to handle filters and pagination
    try {
      // Sample implementation
      const { genre, inStock } = req.query;
      let filters = {};

      if (genre) {
        filters.genre = genre;
      }

      if (inStock) {
        filters.stock = { $gt: 0 }; // Books with stock greater than 0
      }

      const books = await Book.find(filters).exec();
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving books', error });
    }
  },

  createBook: async (req, res) => {
    // Validate request body using JOI
    const schema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().required(),
      genre: Joi.string().required(),
      price: Joi.number().min(0).required(),
      stock: Joi.number().min(0).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      const newBook = await Book.create(req.body);
      res.status(201).json(newBook);
    } catch (error) {
      res.status(400).json({ message: 'Error creating book', error });
    }
  },

  getBookById: async (req, res) => {
    // Implement logic to retrieve a specific book by ID
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving book', error });
    }
  },

  updateBook: async (req, res) => {
    // Validate request body using JOI
    const schema = Joi.object({
      title: Joi.string(),
      author: Joi.string(),
      genre: Joi.string(),
      price: Joi.number().min(0),
      stock: Joi.number().min(0),
    }).min(1); // At least one field is required for updating

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!updatedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(updatedBook);
    } catch (error) {
      res.status(400).json({ message: 'Error updating book', error });
    }
  },

  deleteBook: async (req, res) => {
    // Implement logic to delete a book
    try {
      const deletedBook = await Book.findByIdAndDelete(req.params.id);
      if (!deletedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json({ message: 'Book deleted successfully', deletedBook });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting book', error });
    }
  },
};

module.exports = BookController;






