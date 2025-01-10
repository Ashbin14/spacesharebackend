const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User schema
    required: true,
  },
  content: {
    type: mongoose.Schema.type.flatschema,
    ref: "Flat",
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
