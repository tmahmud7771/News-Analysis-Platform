const User = require("../model/User");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Registration attempt with existing email: ${email}`);
      return res.status(400).json({
        status: "fail",
        message: "Email already exists",
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      role: role || "user", // Default to 'user' if role not specified
    });

    logger.info(`New user registered: ${email}`);
    createSendToken(user, 201, res);
  } catch (error) {
    logger.error(`Error during registration: ${error.message}`);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      logger.warn("Login attempt without email or password");
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      logger.warn(`Failed login attempt for email: ${email}`);
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    logger.info(`User logged in: ${email}`);
    createSendToken(user, 200, res);
  } catch (error) {
    logger.error(`Error during login: ${error.message}`);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.logout = (req, res) => {
  logger.info(`User logged out: ${req.user.email}`);
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    logger.info(`User data retrieved: ${req.user.email}`);
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    logger.error(`Error retrieving user data: ${error.message}`);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
