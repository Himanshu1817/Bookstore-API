
const express = require('express');
const router = express.Router();
const BookController = require('../controllers/bookController');
const jwt = require('jsonwebtoken');


// Middleware to validate JWT token and check user role
const authorizeAdmin = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      console.log("error", err)
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (decoded.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized. Admin role required' });
    }

    // If the user is an Admin, allow access to the protected route
    next();
  });
};

// Routes for Book CRUD operations
router.get('/books', BookController.getAllBooks);
router.post('/books', authorizeAdmin, BookController.createBook);
router.get('/books/:id', BookController.getBookById);
router.put('/books/:id', authorizeAdmin, BookController.updateBook);
router.delete('/books/:id', authorizeAdmin, BookController.deleteBook);


router.post('/buy/:id',BookController.buyBook)


module.exports = router;