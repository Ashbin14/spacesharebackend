import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // using Gmail SMTP service
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail password (or app password)
  },
});

export default transporter;
