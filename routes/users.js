const User = require("../model/schema/User");
const logger = require("../services/log/logService");
const mongoose = require("mongoose");

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
    if (req.body.firstName) {
      user.firstName = req.body.firstName;
      atLeastOneChange = true;
    }
    if (req.body.lastName) {
      user.lastName = req.body.lastName;
      atLeastOneChange = true;
    }
    if (req.body.email) {
      user.email = req.body.email;
      atLeastOneChange = true;
    }
    if (!atLeastOneChange) {
      return res.status(400).send({ message: "There is nothing to update" });
    }
    await user.save();
    return res.status(204).send();
  } catch (error) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

module.exports = {
  updateUser,
};
