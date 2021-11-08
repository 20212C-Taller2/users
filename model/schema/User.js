const mongoose = require("mongoose");
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
  roles: [
    {
      type: String,
      enum: ["admin"],
      required: false,
    },
  ],
  googleData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GoogleData",
  },
});
module.exports = mongoose.model("User", userSchema);
