// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./logger'); // Import the logger module
const booksRoutes = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/my_node_project', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to the database');
});

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to the database:', err);
});

// Middleware
app.use(bodyParser.json());
app.use(cors());






// Log incoming requests
app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.url}`);
  next();
});


// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`[${req.method}] ${req.url} - Error: ${err.message}`);
  res.status(500).json({ message: 'Internal server error.' });
});


// Routes
const booksRouter = require('./routes/books');
const usersRouter = require('./routes/users');
//const loggerMiddleware = require('./middleware/logger');

//app.use(loggerMiddleware); // Using the logger middleware for all routes

app.use('/books', booksRouter);
app.use('/',usersRouter)

app.use('/books', booksRoutes);

app.listen(PORT, () => {
  /*console.log*/logger.info(`Server running on port ${PORT}`);
});