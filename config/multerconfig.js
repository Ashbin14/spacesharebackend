import multer from 'multer';
import path from 'path';

// Set the storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'sp');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter to allow only images (jpeg, jpg, png, gif)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create the multer upload middleware with the defined storage and file filter
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size to 5MB
  fileFilter
});

export default upload;
