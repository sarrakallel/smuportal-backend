const Router = require("express").Router;
const userService = require('../../services/user.service')();
const { loginValidation } = require("../../helpers/validation");

const router = Router({
  mergeParams: true
});

router.post("/login", async (req, res, next) => {
  try {
    loginValidation(req.body);
    const { email, password } = req.body;
    const user = await userService.login(email, password);
    res.send(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
