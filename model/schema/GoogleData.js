const mongoose = require("mongoose");
const googleDataSchema = new mongoose.Schema({
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
module.exports = mongoose.model("GoogleData", googleDataSchema);
