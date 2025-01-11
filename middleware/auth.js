const jwt = require("jsonwebtoken");
const { User } = require("../models/User.js");

module.exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ error: "Authentication token is required." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      isVerified: true,
    });

    if (!user) {
      return res.status(401).json({ error: "User not found or not verified." });
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Please authenticate." });
  }
};
