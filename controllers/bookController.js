
// controllers/bookController.js
const Joi = require('joi');
const Book = require('../models/book');
const axios=require('axios')
const logger = require('../logger');


const Sentry = require('@sentry/node');
Sentry.init({
    dsn: "https://3b55aafdc6804d0b948ae2478917bccb@o201295.ingest.sentry.io/4505602112356352",
    serverName: "himanshu_book-store"
});


//const got = require('got')
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
      Sentry.captureException(error)
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
      Sentry.captureException(error)
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
      Sentry.captureException(error)
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
      Sentry.captureException(error)
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
      Sentry.captureException(error)
      res.status(500).json({ message: 'Error deleting book', error });
    }
  },


/////////////
// controllers/books.js
//const axios = require('axios');
//const Book = require('../models/book');

 // controllers/books.js
//const axios = require('axios');
//const Book = require('../models/book');

 buyBook :async (req, res) => {

          
  try {
    // Check if the book exists in the database
    const book = await Book.findById(req.params.id);

     if (!book) {
      logger.warn(`Book not found with ID: ${req.params.id}`);
       return res.status(404).json({ message: 'Book not found.' });
     }

    // Check if the book is in stock
    if (book.stock <= 0) {
      logger.warn(`Book out of stock with ID: ${req.params.id}`);
      return res.status(400).json({ message: 'Book is out of stock.' });
    }

    // Call external API for payment (replace 'payment-api-url' with the actual payment API URL)
    //req.body.amount=book.price
    const paymentResponse = await axios.post('https://stoplight.io/mocks/skeps/book-store:master/12094368/misc/payment/process',req.body 
      
    );
console.log(paymentResponse)
    // Assuming the payment API returns a payment number in the response
    const paymentNumber = paymentResponse.data.payment_id;

    // Decrease the book's stock by 1 in the database
  //   
  const updatedBook = await Book.findByIdAndUpdate(req.params.id,{stock: book.stock-1}, {returnOriginal : false})
  logger.info(`Book purchased successfully: ID ${req.params.id}, Payment Number: ${paymentNumber}`);
        res.status(200).json(paymentNumber)
  }catch (err) {
    Sentry.captureException(err)
   // console.error(err.message);
    logger.error(`Error while buying book: ${err.message}`);
    res.send("sentry meesege")
    return res.status(500).json({ message: 'error is coming' });
  }

 }
//module.exports = { buyBook };




};







module.exports = BookController;