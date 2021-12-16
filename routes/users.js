const User = require("../model/schema/User");
const logger = require("../services/log/logService");
const mongoose = require("mongoose");
const utils = require("../services/validationsUtils");
const metricsService = require("../services/metricsService");
const constants = require("../model/constants");

async function updateUser(req, res) {
  const userId = req.params.id;
  try {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ message: "Invalid user id format" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "There is no user with id: " + userId });
    }
    let atLeastOneChange = false;
    if (req.body.firstName && !utils.isEmpty(req.body.firstName)) {
      user.firstName = req.body.firstName;
      atLeastOneChange = true;
    }
    if (req.body.lastName && !utils.isEmpty(req.body.lastName)) {
      user.lastName = req.body.lastName;
      atLeastOneChange = true;
    }
    if (req.body.email && utils.isValidMail(req.body.email) && req.body.email !== user.email) {
      const otherUser = await User.findOne({ email: req.body.email });
      if (otherUser) {
        return res.status(409).send({ message: "Sorry, email " + req.body.email + " is already registered." });
      }
      user.email = req.body.email;
      atLeastOneChange = true;
    }
    if (req.body.placeId && !utils.isEmpty(req.body.placeId)) {
      user.placeId = req.body.placeId;
      atLeastOneChange = true;
    }
    if (req.body.interests && Array.isArray(req.body.interests)) {
      user.interests = req.body.interests;
      atLeastOneChange = true;
    }
    if (!atLeastOneChange) {
      return res.status(400).send({ message: "There is nothing valid to update" });
    }
    await user.save();
    return res.status(204).send();
  } catch (error) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

async function getUser(req, res) {
  const userId = req.params.id;
  try {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ message: "Invalid user id format" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "There is no user with id: " + userId });
    }
    res.json(formatUser(user));
  } catch (error) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

async function blockUser(req, res) {
  const userId = req.params.id;
  try {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ message: "Invalid user id format" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "There is no user with id: " + userId });
    }
    if (user.blocked) {
      return res.status(400).send({ message: "Cannot block an already blocked user" });
    }
    user.blocked = true;
    await user.save();
    await metricsService.publishMetric(metricsService.USER_BLOCKED_METRIC);
    return res.status(204).send();
  } catch (error) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

async function unblockUser(req, res) {
  const userId = req.params.id;
  try {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ message: "Invalid user id format" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "There is no user with id: " + userId });
    }
    if (!user.blocked) {
      return res.status(400).send({ message: "Cannot unblock an non blocked user" });
    }
    user.blocked = false;
    await user.save();
    await metricsService.publishMetric(metricsService.USER_UNBLOCKED_METRIC);
    return res.status(204).send();
  } catch (error) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

function formatUser(userSchema) {
  let user = {
    id: userSchema._doc._id,
    firstName: userSchema.firstName,
    lastName: userSchema.lastName,
    email: userSchema.email,
    placeId: userSchema.placeId,
    interests: userSchema.interests,
    blocked: userSchema.blocked,
  };
  if (userSchema.googleData) {
    user.googleData = {
      displayName: userSchema.googleData.displayName,
      userId: userSchema.googleData.userId,
      picture: userSchema.googleData.picture,
    };
  }
  return user;
}

async function getUsers(req, res) {
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 10;
  let userQueryFilter = {}
  if (req.query.appUsers) {
    userQueryFilter.roles = { $ne: constants.ADMIN_ROLE }
  }
  try {
    let [users, userCount] = await Promise.all([
      User.find(userQueryFilter)
        .skip(limit * offset)
        .limit(limit),
      User.countDocuments(userQueryFilter),
    ]);
    res.json({
      users: users.map(formatUser),
      total: userCount,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

async function isBlockedUser(req, res) {
  try {
    const user = await User.findOne({ email: res.locals.subject });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.status(200).send({
      blocked: user.blocked,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

module.exports = {
  updateUser,
  blockUser,
  unblockUser,
  getUsers,
  getUser,
  isBlockedUser,
};
