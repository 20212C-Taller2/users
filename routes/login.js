const User = require("../model/schema/User");
const bcrypt = require("bcryptjs");
const tokenService = require("../services/login/tokenService");
const config = require("../config/config");
const logger = require("../services/log/logService");
const constants = require("../model/constants");

async function login(req, res, userFilters) {
  try {
    const user = await User.findOne(userFilters);
    if (!user) {
      return res.status(404).send({ message: "Sorry, email or password incorrect." });
    }
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null, message: "Sorry, email or password incorrect." });
    } else {
      const token = tokenService.createExpireToken(user.email, config.TOKEN_EXPIRATION_TIME_IN_HS);
      return res.status(200).send({
        auth: true,
        token: token,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }
      });
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: "There was an error with login." });
  }
}

async function loginUser(req, res) {
  return login(req, res, { email: req.body.email, roles: { $ne: constants.ADMIN_ROLE } });
}

async function loginAdmin(req, res) {
  return login(req, res, { email: req.body.email, roles: { $in: [constants.ADMIN_ROLE] } });
}

module.exports = {
  loginUser,
  loginAdmin,
};
