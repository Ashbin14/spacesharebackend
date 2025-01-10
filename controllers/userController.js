const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const mailer = require("../helpers/mailer");
const res = require("express/lib/response");
const userRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({
        success: false,
        msg: error.message,
        error: errors.array,
      });
    }
    const { name, email, moblie, password } = req.body;

    const isExist = await User.findOne({ email });

    if (isExist) {
      return res.status(400).json({
        success: false,
        msg: "email already exits",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      moblie,
      password: hashPassword,
      image: "images/" + req.file.filename,
    });
    const userData = await user.save();
    const msg =
      "<p>Hi," +
      name +
      ',<br> please<a href="http://127.0.0.1:3000/mail-verification?id=' +
      userData._id +
      "> verify</a> your mail.</p>";
    mailer.sendMail();
    return res.status(200).json({
      success: true,
      msg: "regristed sucessfully happened",
      user: userData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const mailVerificaiton = async (req, res) => {
  try {
    if (req.query.id == undefined) {
      return res.render("404");
    }
    const userData = await user.findOne({ _id: req.query.id });
    if (userData) {
    } else {
      return res.render("mail-verificaiton", { message: "user not found" });
    }
  } catch (error) {
    console.log(error.message);
    return res.render("404");
  }
};
module.exports = {
  userRegister,
  mailVerificaiton,
};
