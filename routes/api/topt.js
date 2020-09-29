const Router = require("express").Router;
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const speakeasy = require("speakeasy");
const { verifyToken, getBearerToken } = require("../../helpers/verifyToken");
const { otpEmailMessages, transporter } = require("../../helpers/mailer");

require("dotenv").config();

const router = Router({
  mergeParams: true
});

// Generates secret (Profile view) when APP TOTP is enabled
router.get("/generate-secret", verifyToken, async (req, res) => {
  let user = await User.findById(req.decodedToken._id);
  const secret = user.twoFactorSecret
    ? user.twoFactorSecret
    : speakeasy.generateSecret().base32;
  let url = speakeasy.otpauthURL({
    secret: secret,
    label: user.email,
    issuer: process.env.SITE_NAME,
    encoding: "base32"
  });

  if (!url)
    res.status(500).send({
      success: false,
      message: "Could not generate otpauthURL"
    });

  // If user has already confirmed 2FA, send back existing secret
  if (user.twoFactorConfirmed)
    return res.send({
      success: true,
      otpauthURL: url
    });

  let responseBody = {
    success: true,
    message: "TFA Auth needs to be verified",
    otpauthURL: url
  };

  try {
    responseBody.dataURL = await QRCode.toDataURL(url);
  } catch {
    return res.status(500).send({
      success: false,
      message: "Could not generate QRCode"
    });
  }

  user.twoFactorSecret = secret;
  user.twoFactorType = "app";
  user.twoFactorEnabled = true;

  try {
    await user.save();
  } catch {
    return res.status(500).send({
      success: false,
      message: "Internal Error 500"
    });
  }
  return res.send(responseBody);
});

// Disable 2FA
router.delete("/revoke-secret", verifyToken, async (req, res) => {
  const user = await User.findById(req.decodedToken._id);
  let otp = req.headers["x-otp"];

  if (!otp)
    return res.status(400).send({
      success: false,
      message: "OTP required"
    });

  if (!user.twoFactorEnabled || !user.twoFactorConfirmed)
    return res.status(401).send({
      success: false,
      message: "Cannot revoke secret"
    });

  let verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: otp
  });

  if (!verified)
    return res.status(400).send({
      success: false,
      message: "Invalid OTP"
    });
  // Update user 2FA status
  user.twoFactorSecret = undefined;
  user.twoFactorEnabled = false;
  user.twoFactorConfirmed = false;

  try {
    await user.save();
  } catch {
    res.status(500).send({
      sucess: false,
      message: "Internal Server Error 500"
    });
  }
  return res.send({
    success: true
  });
});

// Generate sceret and add it to the user's record in the database (2FA via email)
// This will be used to enable 2FA via email
router.get("/generate-secret-email", verifyToken, async (req, res) => {
  // Fetch user the by id provided in the JWT token
  let user = await User.findById(req.decodedToken._id);
  // Create a secret
  const secret = user.twoFactorSecret
    ? user.twoFactorSecret
    : speakeasy.generateSecret().base32;
  // The response body.
  let responseBody = {
    success: true,
    message: "TFA Auth needs to be verified"
  };
  // Update the "emailTwoFASecret" with the secret generated (mySecret)
  user.twoFactorSecret = secret;
  user.twoFactorType = "email";
  user.twoFactorEnabled = true;

  // Update the user's record
  try {
    await user.save();
  } catch {
    return res.status(500).send({
      success: false,
      message: "Internal Error 500"
    });
  }
  return res.send(responseBody);
});

/* Assuming the token generated from the authentication endpoint is valid,
  we check to see if the passed one-time password is valid using the 2FA library we had downloaded.
  If the password is valid, we update the authorized property and return a new token.
  Enables 2FA and creates a valid token

  PS: @Marwen, Added 'window: 2' to the verification
  of the TOTP, so maybe switch verification depending on whether the user enabled APP2FA or Email2FA
  , i.e if(user.twoFactorType == Email) {...}
        if(user.twoFactorType == app) {...}
*/
router.post("/verify-totp", verifyToken, async (req, res) => {
  let otp = req.body.otp;
  if (!otp)
    return res.status(400).send({
      success: false,
      message: "OTP required"
    });
  // Verify a given token
  let user, verified, window;
  user = await User.findById(req.decodedToken._id);
  // Set window time according to 2FA type
  window = user.twoFactorType === "email" ? 6 : 2;
  console.log(window, user.twoFactorSecret, otp);
  verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: otp,
    window: window
  });
  // [Testing]
  console.log("verified => ", verified);

  if (verified) {
    // Update token status
    req.decodedToken.authorized = true;
    // Update user 2FA status
    user.twoFactorConfirmed = true;
    try {
      await user.save();
    } catch {
      res.status(500).send({
        sucess: false,
        message: "Internal Server Error 500"
      });
    }

    // Generate new token after OTP has been confirmed
    let token = jwt.sign(req.decodedToken, process.env.APP_SECRET, {});
    return res.send({
      success: true,
      token: token
    });
  } else {
    return res.status(401).send({
      success: false,
      message: "Invalid OTP"
    });
  }
});

/*
  Enable 2FA APP
  Generate Secret -> QR Code + Secret
  User scans secret on APP
  User gets code
  User enters code
  Front makes call to verify TOTP

*/

// Send TOTP via email
router.get("/generate-totp", verifyToken, async (req, res) => {
  // Fetch user the by id provided in the JWT token
  let user = await User.findById(req.decodedToken._id);
  // Generate a otp from the user's secret
  let otp = speakeasy.totp({
    secret: user.twoFactorSecret,
    encoding: "base32"
  });
  // [Testing]
  console.log(otp);
  // Sends it via email
  transporter.sendMail(otpEmailMessages(user.email, otp).sendOtp(), function(
    error,
    info
  ) {
    if (error) {
      // [Testing]
      console.log(error);
    } else {
      // [Testing]
      console.log("Email sent: " + info.response);
    }
  });

  res.send({
    otp: otp
  });
});

module.exports = router;
