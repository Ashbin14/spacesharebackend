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

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    await Token.create({ userId: user._id, token });
    res.status(200).json({ message: 'Login successful',email,password, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists'
      });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password, 
    });


    res.status(201).json({
      status: 'success',
      message: 'Registration successful'
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
