require("./db");
require("../user.model");
const mongoose = require("mongoose");
const crypto = require("crypto");

const UserModel = mongoose.model("User");

// Lab 1
const simpleSignUp = async user => {
  const newUser = new UserModel(user);
  await newUser.save();
};

const simpleLogin = async user => {
  return await UserModel.findOne(user);
};

// Lab 2
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

// Lab 4
const generateSalt = () => crypto.randomBytes(32).toString("hex");

const hashSaltSignUp = async user => {
  const salt = generateSalt();
  const digest = crypto
    .createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  const userWithDigest = { username: user.username, password: digest, salt };
  const newUser = new UserModel(userWithDigest);
  return await newUser.save();
};

const getHashPassword = (salt, password) => {
  return crypto
    .createHmac("sha256", salt)
    .update(password)
    .digest("hex");
};

const hashSaltLogin = async user => {
  const result = await simpleLogin({ username: user.username });
  const salt = result.salt;

  const hashPassword = getHashPassword(salt, user.password);
  if (hashPassword === result.password) {
    return { username: result.username };
  }
};

//

module.exports = {
  simpleSignUp,
  simpleLogin,
  hashSignUp,
  hashLogin,
  hashSaltSignUp,
  hashSaltLogin
};
