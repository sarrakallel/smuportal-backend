const bcrypt = require("bcryptjs");
const authBasic = require("../helpers/authBasic");
const User = require("../models/User");

require("dotenv").config();

function userService() {
  async function getUsers() {
    return User.find({});
  }

  async function addUser(userData) {
    return User.create(userData);
  }

  async function getUserById(id) {
    return User.findById(id);
  }

  async function getUserByEmail(email) {
    const query = { email: email };
    return User.findOne(query);
  }

  async function updateUser(user, param) {
    Object.assign(user, param);
    await user.save();
  }

  async function register(userInput, role_id) {
    try {
      const hashedPassword = await bcrypt.hash(userInput.password, 10);
      const user = await addUser({
        ...userInput,
        password: hashedPassword,
        _roleId: role_id
      });
      if (!user) {
        throw new Error("User cannot be created");
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  async function login(email, password) {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not registered");
    }
    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) {
      throw new Error("Invalid credentials");
    }

    if (!user.enabled) {
      throw new Error("Account disabled");
    }

    if (!user.emailConfirmed) {
      throw new Error("Email not confirmed");
    }

    const token = await authBasic.createTokens(
      user,
      process.env.APP_SECRET,
      process.env.TOKEN_EXPIRES_IN
    );

    // userObj holds the modified user object
    let userObj;
    if (user.twoFactorConfirmed) {
      userObj = {
        token,
        twoFactorEnabled: user.twoFactorEnabled,
        twoFactorType: user.twoFactorType
      };
    } else {
      userObj = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        token
      };
    }
    return userObj;
  }

  return {
    getUsers,
    addUser,
    getUserById,
    getUserByEmail,
    updateUser,
    register,
    login
  };
}

module.exports = userService;
