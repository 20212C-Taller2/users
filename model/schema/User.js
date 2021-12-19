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

let userSchema = new mongoose.Schema({
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
  fcmtoken: {
    type: String,
  },
  googleData: {
    type: GoogleDataSchema,
  },
});

userSchema.methods.name = function () {
  if (this.googleData) {
    return this.googleData.displayName;
  }
  return this.firstName + " " + this.lastName;
};

module.exports = mongoose.model("User", userSchema);
