const User = require("../model/schema/User");
const bcrypt = require("bcryptjs");
const tokenService = require("../services/login/tokenService");
const config = require("../config/config");
const logger = require("../services/log/logService");

async function registerUser(req, res) {
  //TODO
}

module.exports = {
  registerUser,
};
