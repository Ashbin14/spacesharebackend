import User from '../models/user.js';  // Import user model 
import jwt from 'jsonwebtoken';  // Import jwt only once
import transporter from '../config/mailer.js';  // Import mail transporter
import dotenv from 'dotenv';  // Import dotenv for environment variables
import bcrypt from 'bcryptjs';  // Import bcrypt for password hashing
import crypto from 'crypto';  // Import crypto for generating random tokens

dotenv.config();  // Load environment variables from .env file

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
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
      password
    });

    await user.save();
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
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
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

const verifyMail = async (req, res) => {
  const { token } = req.query;

  // Find the user by verification token
  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() }, // Check if token has expired
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;

  await user.save();

  res.status(200).json({ message: 'Email successfully verified' });
};

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No token, authorization denied'
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Token is not valid'
    });
  }
};

export default { login, register, verifyMail, auth };
