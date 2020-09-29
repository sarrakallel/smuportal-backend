require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const emailMessages = (email, url) => {
  return {
    confirmEmail: function() {
      return {
        to: email,
        subject: "Confirm Email",
        html: `Please click this link to confirm your account <a href="${url}">${url}</a>`
      };
    },
    resetPassword: function() {
      return {
        to: email,
        subject: "Reset password",
        html: `Please click this link to reset your account <a href="${url}">${url}</a>`
      };
    }
  };
};

const otpEmailMessages = (email, otp) => {
  return {
    sendOtp: function() {
      return {
        to: email,
        subject: "Two Factor Authorization Code",
        html: `Code : ${otp}`
      };
    }
  };
};

const boxBookingConfirmation = (user, email, box, date, start, end) => {
  return {
    sendBoxConfirmation: function() {
      return {
        to: email,
        subject: "Box reservation",
        html: `<h3><strong>Dear ${user},</strong></h3> Box ${box} has been booked for you on the ${date} from ${start} until ${end}.
        <br>
        <br>Please make sure to keep the box clean after you leave.
        <br>
        <br>Thank you,
        <br>Library Team
        <br>
        <br>
        <hr>
    <div style="color:rgb(127, 127, 127);font-size:small;text-align:center"><em>ISS396 Project, Booking System Application.</em></div>`
      };
    }
  };
};
// Get OAuth2 "session" token
const oauth2Client = new OAuth2(
  process.env.G_CLIENT_ID,
  process.env.G_CLIENT_SECRET,
  process.env.G_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.G_REFRESH_TOKEN
});

// Refresh token might be broken! We need to fix it

// NodeMailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    type: process.env.SMTP_TYPE,
    user: process.env.SMTP_USER,
    clientId: process.env.G_CLIENT_ID,
    clientSecret: process.env.G_CLIENT_SECRET,
    refreshToken: process.env.G_REFRESH_TOKEN,
    accessToken: process.env.G_ACCESS_TOKEN
  }
});

module.exports = {
  emailMessages: emailMessages,
  otpEmailMessages: otpEmailMessages,
  transporter: transporter,
  boxBookingConfirmation: boxBookingConfirmation
};
