const Router = require("express").Router;
const User = require("../../models/User");
const Token = require("../../models/Token");

const router = Router({
  mergeParams: true
});

router.get("/confirmation/:token", async (req, res) => {
  const token = await Token.findOne({
    token: req.params.token,
    tokenType: "confirmEmail"
  });
  if (!token)
    return res.status(400).send({
      message: "Invalid token"
    });

  const user = await User.findOne({
    _id: token._userId
  });
  if (!user) return res.status(500).send();
  if (user.enabled || user.emailConfirmed)
    return res.status(400).send({
      message: "User has already been verified."
    });

  user.emailConfirmed = true;
  user.enabled = true;

  // Update user collection
  try {
    await user.save();
    res.send({
      message: "Email confirmed"
    });
  } catch (err) {
    res.status(500).send();
  }
});

router.post("/confirmation-resend", async (req, res) => {
  // Work in progress
});

module.exports = router;
