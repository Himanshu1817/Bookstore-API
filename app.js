// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

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

// Routes
const booksRouter = require('./routes/books');
const usersRouter = require('./routes/users');
const loggerMiddleware = require('./middleware/logger');

app.use(loggerMiddleware); // Using the logger middleware for all routes

app.use('/books', booksRouter);
app.use(usersRouter)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
