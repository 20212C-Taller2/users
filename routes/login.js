const User = require("../model/schema/User");
const bcrypt = require("bcryptjs");
const tokenService = require("../services/login/tokenService");
const config = require("../config/config");
const logger = require("../services/log/logService");
const constants = require("../model/constants");
const admin = require("firebase-admin");
const secret = JSON.parse(config.FIREBASE_SECRET);

function createUserResponse(user, token) {
  let response = {
    auth: true,
    token: token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      placeId: user.placeId,
    },
  };
  if (user.googleData) {
    response.googleData = {
      displayName: user.googleData.displayName,
      userId: user.googleData.userId,
      picture: user.googleData.picture,
    };
  }
  return response;
}

async function login(req, res, userFilters) {
  try {
    const user = await User.findOne(userFilters);
    if (!user) {
      return res.status(404).send({ message: "Sorry, email or password incorrect." });
    }
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null, message: "Sorry, email or password incorrect." });
    }
    if (user.blocked) {
      return res.status(401).send({ auth: false, token: null, message: "The user is blocked." });
    }
    const token = tokenService.createExpireToken(user.email, config.TOKEN_EXPIRATION_TIME_IN_HS);
    return res.status(200).send(createUserResponse(user, token));
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

async function loginGoogle(req, res) {
  const googleToken = req.body.googleToken;
  admin.initializeApp({
    credential: admin.credential.cert(secret),
  });
  admin
    .auth()
    .verifyIdToken(googleToken)
    .then(async (decodedToken) => {
      let user = await User.findOne({ email: decodedToken.email, roles: { $ne: constants.ADMIN_ROLE } });
      if (!user) {
        user = new User({
          email: decodedToken.email,
          googleData: {
            displayName: decodedToken.name,
            picture: decodedToken.picture,
            userId: decodedToken.user_id,
          },
        });
        await user.save();
      }
      if (user.blocked) {
        return res.status(401).send({ auth: false, token: null, message: "The user is blocked." });
      }
      const token = tokenService.createExpireToken(user.email, config.TOKEN_EXPIRATION_TIME_IN_HS);
      return res.status(200).send(createUserResponse(user, token));
    })
    .catch((error) => {
      return res.status(401).send({ auth: false, token: null, message: "Invalid user google token." });
    });
}

module.exports = {
  loginUser,
  loginAdmin,
  loginGoogle,
};
