const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const createTokens = async (user, appSecret, expiration) => {
  const accessToken = jwt.sign(
    {
      _id: user._id,
      authorized: !user.twoFactorEnabled,
    },
    appSecret,
    {
      expiresIn: expiration,
    }
  );

  const refreshToken = crypto.randomBytes(32).toString('hex');

  return Promise.resolve(accessToken);
};

module.exports = {
  createTokens: createTokens,
};
