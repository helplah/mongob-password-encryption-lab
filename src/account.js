require("./db");
require("../user.model");
const mongoose = require("mongoose");

const UserModel = mongoose.model("User");

const simpleSignUp = async input => {
  const newUser = new UserModel(input);
  await newUser.save();
};

const simpleLogin = async input => {
  return await UserModel.findOne(input);
};

module.exports = {
  simpleSignUp,
  simpleLogin
};
