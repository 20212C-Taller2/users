const User = require("../model/schema/User");
const logger = require("../services/log/logService");
const mongoose = require("mongoose");
const utils = require("../services/validationsUtils");

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
    return res.status(204).send();
  } catch (error) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

module.exports = {
  updateUser,
  blockUser,
  unblockUser,
};
