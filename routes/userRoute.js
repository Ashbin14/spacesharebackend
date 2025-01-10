const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const userController = require("../controllers/userController");
const { registerValidator } = require("../helpers/validation");

const router = express();

// Enable CORS for all origins or specific origins
router.use(cors({ origin: "http://localhost:5173" }));
router.use(express.json());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, files, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

// Routes
router.post(
  "/register",
  upload.single("image"),
  registerValidator,
  userController.userRegister
);

module.exports = router;
