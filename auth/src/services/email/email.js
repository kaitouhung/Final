const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

const hogan = require('hogan.js');

// read template and render html
const template = fs.readFileSync('src/services/email/email.hjs', 'utf-8');
const compiledTemplate = hogan.compile(template);

module.exports.sendMailToUser = (email, title, message, resetURL) => {
  try {
    const transport = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      requireSSL: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    };

    const transporter = nodemailer.createTransport(transport);

    const mailOptions = {
      from: process.env.EMAIL,
      to: `${email}`,
      subject: title,
      html: compiledTemplate.render({
        info: resetURL ? resetURL : email,
        message: message,
      }),
    };

    return transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error.message);
  }
};

// const transport = {
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false,
//   requireTLS: true,
//   requireSSL: true,
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASS,
//   },
// };

// const transporter = nodemailer.createTransport(transport);

// module.exports.sendRegisterMail = (email) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: `${email}`,
//       subject: 'Register Success',
//       html: compiledTemplate.render({
//         info: email,
//         message: 'Thank you for registering. Visit my website.',
//       }),
//     };

//     return transporter.sendMail(mailOptions);
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// module.exports.sendPasswordReset = (resetURL, email) => {
//   try {
//     const mailOptions = {
//       from: process.env.PASS,
//       to: `${email}`,
//       subject: 'Reset Password',
//       html: compiledTemplate.render({
//         info: resetURL,
//         message: 'This is email forgot password! Click to Reset Password',
//       }),
//     };

//     return transporter.sendMail(mailOptions);
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };
