const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
import spaceRoutes from './routes/spaceRoutes.js';
const  userProfie =require('./routes/userRoute.js');
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

  
app.use('/api/auth', authRoutes);


app.use('/uploads', express.static('uploads'));

// Routes for uploading 
app.use('/api', spaceRoutes);

//for profile 
app.use('/profile',userProfie);

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File size is too large. Maximum size is 5MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'File limit exceeded. Maximum 5 images allowed'
      });
    }
  }
  res.status(500).json({ error: error.message });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));