const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const userService = require("./user.service")();

function tfaService() {
  async function getSecret(user) {
    if (!user.twoFactorSecret) {
      throw Error("User does not have a secret");
    }
    return user.twoFactorSecret;
  }

  async function generateSecret(user) {
    if (user.twoFactorSecret) {
      throw Error("User already has a secret");
    }
    const secret = {
      twoFactorSecret: speakeasy.generateSecret().base32
    };
    userService.updateUser(user, secret);
  }

  async function getOtpauthURL(user) {
    const secret = getSecret(user);
    let url = speakeasy.otpauthURL({
      secret: secret,
      label: user.email,
      issuer: process.env.SITE_NAME,
      encoding: "base32"
    });
    if (!url) {
      throw Error("Unable to generate OTP Auth URL");
    }
  }

  async function getQRCode(url) {
    const qrCode = await QRCode.toDataURL(url);
    if (!qrCode) {
      throw Error("Unable to generate QRCode");
    }
    return qrCode;
  }

  return {
    getSecret,
    generateSecret,
    getOtpauthURL,
    getQRCode
  };
}

module.exports = tfaService;
