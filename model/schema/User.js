const mongoose = require("mongoose");

const GoogleDataSchema = new mongoose.Schema({
  displayName: {
    type: String,
  },
  userId: {
    type: String,
  },
  picture: {
    type: String,
  },
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  placeId: {
    type: String,
  },
  interests: {
    type: [String],
    default: [],
  },
  roles: [
    {
      type: String,
      enum: ["admin"],
      required: false,
    },
  ],
  googleData: {
    type: GoogleDataSchema,
  },
});
module.exports = mongoose.model("User", userSchema);
