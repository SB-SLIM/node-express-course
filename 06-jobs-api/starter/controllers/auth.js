const BadRequestError = require("../errors/bad-request.js");
const CustomAPIError = require("../errors/custom-api.js");
const User = require("../models/User.js");
const { StatusCodes } = require("http-status-codes");
const { bcryptPassword } = require("../utils/functions.js");
const UnauthenticatedError = require("../errors/unauthenticated.js");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // if (!email || !password || !name) {
  //   throw new BadRequestError('Please provide email and password and name');
  // }

  const user = await User.create({ name, email, password });
  const token = user.createJwt();

  res
    .status(StatusCodes.CREATED)
    .json({ user: { id: user._id, name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJwt();

  res
    .status(StatusCodes.OK)
    .json({ user: { id: user._id, name: user.name }, token });
};

module.exports = { register, login };
