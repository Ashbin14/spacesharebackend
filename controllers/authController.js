import User from '../models/user.js';  // Import user model 
import jwt from 'jsonwebtoken';  // Import jwt only once
import transporter from '../config/mailer.js';  // Import mail transporter
import dotenv from 'dotenv';  // Import dotenv for environment variables
import bcrypt from 'bcryptjs';  // Import bcrypt for password hashing
import crypto from 'crypto';  // Import crypto for generating random tokens
import Token from '../models/token.js';
import auth from '../middleware/auth.js';

dotenv.config();  
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send response
    res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          email: user.email
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
}
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email });

//     if (!user) {
//       console.log('No user found with email:', email);  // Debugging: Check email lookup
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Debugging: Check the user object
//     console.log('User found:', user);

//     // Validate that password is provided
//     if (!password) {
//       return res.status(400).json({ message: 'Password is required' });
//     }

//     const isPasswordValid = await user.method.authcomparePassword(password);
//     if (!isPasswordValid) {
//       console.log('Invalid password attempt for email:', email);  // Debugging: Password mismatch
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

//     // Store the token in the Token collection
//     await Token.create({ userId: user._id, token });
//     res.status(200).json({
//       message: 'Login successful',
//       user: { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
//       token,
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists'
      });
    }

    // Hash the password

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      email,
      password
    });

    const result = await user.save();
    result.password = undefined; // Ensure password is not returned in the response

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      result,
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};
const logout = async (req, res) => {
  try {
    const token = req.token;
    await Token.findOneAndDelete({ token });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Auth middleware
// const auth = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({
//         status: 'error',
//         message: 'No token, authorization denied'
//       });
//     }
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
    
//   } catch (error) {
//     res.status(401).json({
//       status: 'error',
//       message: 'Token is not valid'
//     });
//   }
// };

export default { login, register, logout};
