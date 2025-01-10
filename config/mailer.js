import { model } from 'mongoose';  // ES module import
import nodemailer from 'nodemailer';  // ES module import

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password
  }
});

//module.exports = transporter;
const transporter1 = nodemailer.createTransport(transporter);
export default transporter1;
