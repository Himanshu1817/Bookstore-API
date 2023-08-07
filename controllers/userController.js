// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


    

const UserController = {

  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Check if the username exists in the database
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Generate a JWT token upon successful login
      const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, 'your-secret-key', {
        expiresIn: '1h', // Token expires in 1 hour. Adjust as per your requirements.
      });

      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  },

   registerUser: async (req, res) => {
      try {
        console.log("in controller")
        const { username, password, role } = req.body;
  
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
        }
  
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const newUser = new User({
          username,
          password: hashedPassword,
          role: role || 'Customer', // If role is not provided, set it to 'Customer' by default
        });
  
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        console.log("In register catch",error)
        res.status(500).json({ message: 'Error registering user', error });
      }
    },
};

module.exports = UserController;
