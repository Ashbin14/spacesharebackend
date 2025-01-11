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
      password,
      verificationToken: crypto.randomBytes(32).toString('hex'), // Generate token
      verificationTokenExpires: Date.now() + 3600000, // Token expires in 1 hour
    });

    await user.save();

    // Send verification email with the token
    const verificationLink = `${process.env.BASE_URL}/verifyMail?token=${user.verificationToken}`;
    
    const mailOptions = {
      from: 'no-reply@yourapp.com',
      to: user.email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the following link: ${verificationLink}`
    };

    // Send email using transporter (your mail config)
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful, please check your email to verify your account'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
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

export default { login, register, auth };
