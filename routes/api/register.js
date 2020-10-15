const Router = require("express").Router;
const userService = require("../../services/user.service")();
const roleService = require("../../services/role.service")();
const Token = require("../../models/Token");
const crypto = require("crypto");
const { authEmailMessages, transporter } = require("../../helpers/mailer");
const { registerValidation } = require("../../helpers/validation");

const router = Router({
  mergeParams: true,
});

router.post("/register", async (req, res, next) => {
  try {
    // Check form against registration requirements
    registerValidation(req.body);
    const roleId = await roleService.getRoleIdByRoleName("student");
    const user = await userService.register(req.body, roleId);

    // Should be moved to a token service
    const token = new Token({
      _userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
      tokenType: "confirmEmail",
    });

    // Should be removed, for testing purposes only!
    const confirmationUrl =
      `http://localhost:4200/confirm-email/` + token.token;

    // Should be moved to mailer service
    transporter.sendMail(
      authEmailMessages(user.email, confirmationUrl).confirmEmail(),
      function (error, info) {
        if (error) {
          throw error;
        } else {
          console.log("Email sent:", info.response);
        }
      }
    );
    await token.save();
    res.send({ success: true }).status(201);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
