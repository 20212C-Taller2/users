const jwt = require("jwt-simple");
const config = require("./../../config/config.js");
const moment = require("moment");

exports.createExpireToken = (subject, expirationDurationInHours) => {
  const payload = {
    sub: subject,
    iat: moment().unix(),
    exp: moment().add(expirationDurationInHours, "hour").unix(),
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
};
