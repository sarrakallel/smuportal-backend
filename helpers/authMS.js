/*
node-tutorial https://github.com/jasonjoh/node-tutorial

Copyright (c) Microsoft Corporation
All rights reserved.

MIT License:

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
""Software""), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
require("dotenv").config();

const credentials = {
  client: {
    id: process.env.MS_APP_ID,
    secret: process.env.MS_APP_PASSWORD
  },
  auth: {
    tokenHost: "https://login.microsoftonline.com",
    authorizePath: "common/oauth2/v2.0/authorize",
    tokenPath: "common/oauth2/v2.0/token"
  }
};

const oauth2 = require("simple-oauth2").create(credentials);

function getAuthUrl() {
  const returnVal = oauth2.authorizationCode.authorizeURL({
    redirect_uri: process.env.MS_REDIRECT_URI,
    scope: process.env.MS_APP_SCOPES
  });
  console.log(`Generated auth url: ${returnVal}`);
  return returnVal;
}

async function getTokenFromCode(auth_code) {
  let result = await oauth2.authorizationCode.getToken({
    code: auth_code,
    redirect_uri: process.env.MS_REDIRECT_URI,
    scope: process.env.MS_APP_SCOPES
  });

  const token = oauth2.accessToken.create(result);
  console.log('Token created: ', token.token);
  return token.token.access_token;
}

async function refreshToken(refresh_token) {
  if (refresh_token) {
    const newToken = await oauth2.accessToken.create({
      refresh_token: refresh_token
    }).refresh();
    console.log("New Token: " + newToken);
    return newToken.token;
  }
}

function clearCookies(res) {
  // Clear cookies
  res.clearCookie('graph_access_token', {
    maxAge: 3600000,
    httpOnly: true
  });
  res.clearCookie('graph_user_name', {
    maxAge: 3600000,
    httpOnly: true
  });
}

module.exports = {
  getAuthUrl: getAuthUrl,
  getTokenFromCode: getTokenFromCode,
  refreshToken: refreshToken,
  clearCookies: clearCookies
};
