const Router = require("express").Router;
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Token = require("../../models/Token");
const { emailMessages, transporter } = require("../../helpers/mailer");
const { changePasswordValidation } = require("../../helpers/validation");

const router = Router({
  mergeParams: true
});

//It s like a request to change password
router.post("/resetLogin", async (req, res) => {
  // Check if email exists
  const userExists = await User.findOne({
    email: req.body.email
  });

  if (!userExists)
    return res.status(400).send({
      message: "Email not found!"
    });

  const token = new Token({
    _userId: userExists._id,
    token: crypto.randomBytes(32).toString("hex"),
    tokenType: "passwordReset"
  });

  const confirmationUrl =
    `http://localhost:4200/response-reset-password/` + token.token;

  transporter.sendMail(
    emailMessages(userExists.email, confirmationUrl).resetPassword(),
    function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );

  // Save token in db
  try {
    await token.save();
    console.log(token);
  } catch (err) {
    return res.status(500).send({
      success: false
    });
  }

  return res.send({
    success: true
  });
});

// Verify the token
router.get("/resetPasswordConfirmation/:token", async (req, res) => {
  const token = await Token.findOne({
    token: req.params.token,
    tokenType: "passwordReset"
  });
  if (!token)
    return res.status(400).send({
      message: "Invalid token"
    });

  const user = await User.findOne({
    _id: token._userId
  });
  if (!user) return res.status(500).send();
  //|| tokenType != 'passwordReset'
  // Update user collection
  try {
    await user.save();
  } catch (err) {
    return res.status(500).send();
  }

  return res.send({
    success: true
  });
});

//Change Password
router.post("/changePassword/:token", async (req, res) => {
  console.log(req.body);
  const { error } = changePasswordValidation(req.body);

  if (error)
    return res.status(400).send({
      message: error.details[0].message
    });

  const token = await Token.findOne({
    token: req.params.token,
    tokenType: "passwordReset"
  });

  if (!token)
    return res.status(400).send({
      message: "Invalid token"
    });
  console.log(token);

  const user = await User.findOne({
    _id: token._userId
  });
  if (!user) return res.status(500).send();

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user.password = hashedPassword;

  try {
    await user.save();
  } catch (err) {
    return res.status(500).send();
  }

  return res.send({
    success: true
  });
});

module.exports = router;
