require("./db");
require("../user.model");
const mongoose = require("mongoose");
const crypto = require("crypto");

const UserModel = mongoose.model("User");

const simpleSignUp = async user => {
  const newUser = new UserModel(user);
  await newUser.save();
};

const simpleLogin = async user => {
  return await UserModel.findOne(user);
};

const hashPassword = userPassword => {
  const hash = crypto.createHash("sha256");
  hash.update(userPassword);
  const digest = hash.digest("hex");
  return digest;
};

const hashSignUp = async user => {
  const { username, password } = user;
  const digest = hashPassword(password);
  const userWithDigest = { username, password: digest };
  await simpleSignUp(userWithDigest);
};

const hashLogin = async user => {
  const { username, password } = user;
  const digest = hashPassword(password);

  const userWithDigest = { username, password: digest };
  const foundUser = await simpleLogin(userWithDigest);
  return { username: foundUser.username };
  // return { username: (await simpleLogin(userWithDigest)).username };
};

module.exports = {
  simpleSignUp,
  simpleLogin,
  hashSignUp,
  hashLogin
};
