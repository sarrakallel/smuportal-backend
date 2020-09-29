const jwt = require('jsonwebtoken');

function getBearerToken(headers) {
  const token = (headers.authorization === undefined) ? undefined : headers.authorization.replace('Bearer ', '');
  return token;
}

function verifyToken(req, res, next) {
  const token = getBearerToken(req.headers);
  // Token not provided
  if (!token) return res.status(401).send({
    success: false,
    message: 'Access denied'
  });

  jwt.verify(token, process.env.APP_SECRET, (err, decodedToken) => {
    // Could not sign token
    if (err)
      return res.status(401).send({
        success: false,
        message: "Invalid authorization token"
      });
    // Authorized token (2FA disabled)
    /* authorized exists on the decodedToken object and is true. This value will be true if 2FA is disabled or if 2FA happened successfully. */
    if (decodedToken.authorized) {
      req.decodedToken = decodedToken;
      next();
      // Unauthorized token (2FA enabled)
    } else {
      return res.status(401).send({
        success: false,
        message: "Invalid authorization token"
      });
    }
  });
}

module.exports = {
  getBearerToken: getBearerToken,
  verifyToken: verifyToken
};
