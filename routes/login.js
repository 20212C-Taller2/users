const User = require("../model/schema/User");
const bcrypt = require("bcryptjs");
const tokenService = require("../services/login/tokenService");
const config = require("../config/config");
const logger = require("../services/log/logService");

async function loginUser(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "Sorry, email or password incorrect." });
    }
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null, message: "Sorry, email or password incorrect." });
    } else {
      const token = tokenService.createExpireToken(user.email, config.TOKEN_EXPIRATION_TIME_IN_HS);
      return res.status(200).send({ auth: true, token: token });
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: "There was an error with login." });
  }
}

module.exports = {
  loginUser,
};
