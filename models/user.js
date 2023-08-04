// models/user.js
// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Customer'], default: 'Customer' },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

///////







