const Router = require("express").Router;
const User = require("../../models/User");

const { verifyToken } = require("../../helpers/verifyToken");

const router = Router({
  mergeParams: true
});

router.get("/profile", verifyToken, async (req, res) => {
  const user = await User.findById(req.decodedToken._id);
  let lastLogin = new Date();
  let userInfo = {
    firstName: user.firstName,
    lastName: user.lastName,
    universityID: user.universityID,
    email: user.email,
    lastLogin: lastLogin,
    registeredOn: user.registeredOn
  };
  res.send(userInfo);
});

module.exports = router;
