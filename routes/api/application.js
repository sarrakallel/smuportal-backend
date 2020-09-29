const Router = require("express").Router;
const appService = require("../../services/app.service")();
const userService = require("../../services/user.service")();
const { verifyToken } = require("../../helpers/verifyToken");
const router = Router({ mergeParams: true });

router.get("/apps", verifyToken, async (req, res) => {
  const user = await userService.getUserById(req.decodedToken._id);
  res.send(await appService.getAppsByRoleId(user._roleId));
});

module.exports = router;
