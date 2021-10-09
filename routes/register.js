const User = require("../model/schema/User");
const bcrypt = require("bcryptjs");
const tokenService = require("../services/login/tokenService");
const config = require("../config/config");
const logger = require("../services/log/logService");
const utils = require("../services/validationsUtils");
const constants = require("../model/constants");

function validateUserRegistrationRequest(req) {
  let response = {
    isValid: false,
  };

  if (!utils.isValidMail(req.body.email)) {
    response.message = "Invalid email address.";
    return response;
  }

  if (utils.isEmpty(req.body.firstName)) {
    response.message = "Invalid empty First Name.";
    return response;
  }

  if (utils.isEmpty(req.body.lastName)) {
    response.message = "Invalid empty Last Name.";
    return response;
  }

  if (utils.isEmpty(req.body.password)) {
    response.message = "Password cannot be empty.";
    return response;
  }

  return {
    isValid: true,
  };
}

async function registerUser(req, res) {
  const noRoles = [];
  return registerWithRoles(req, res, noRoles);
}

async function registerAdmin(req, res) {
  const adminRole = [constants.ADMIN_ROLE];
  return registerWithRoles(req, res, adminRole);
}

async function registerWithRoles(req, res, roles) {
  const validationResult = validateUserRegistrationRequest(req);
  if (!validationResult.isValid) {
    return res.status(400).send({ message: validationResult.message });
  }
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).send({ message: "Sorry, email " + req.body.email + " is already registered." });
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    });
    if (roles.length > 0) {
      newUser.roles = roles;
    }
    await newUser.save();
    const token = tokenService.createExpireToken(req.body.email, config.TOKEN_EXPIRATION_TIME_IN_HS);
    return res.status(200).send({ auth: true, token: token, user: newUser });
  } catch (error) {
    logger.error("Error registering a new User: " + req);
    logger.error(error);
    return res.status(500).send({ message: "There was a problem registering the user." });
  }
}

module.exports = {
  registerUser,
  registerAdmin,
};
