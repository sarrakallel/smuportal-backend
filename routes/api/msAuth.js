const Router = require('express').Router;
const authMS = require('../../helpers/authMS');

const router = Router({
  mergeParams: true
});

/* GET url page. */
router.get('/connect', function (req, res) {
  let parms = {};
  parms.signInUrl = authHelper.getAuthUrl();
  parms.debug = parms.signInUrl;
  res.send(parms);
});

/* GET /authorize. */
router.get('/authorize', async (req, res) => {
  // Get auth code
  const code = req.query.code;
  // If code is present, use it
  if (code) {
    let token;
    try {
      token = await authMS.getTokenFromCode(code);
      res.send({
        debug: `Access token: ${token}`
      });
    } catch (error) {
      res.status(400).send({
        title: 'Error',
        message: 'Error exchanging code for token',
        error: error
      });
    }
  } else {
    // Otherwise complain
    res.status(400).send({
      title: 'Error',
      message: 'Authorization error',
      error: {
        status: 'Missing code parameter'
      }
    });
  }
});

module.exports = router;
