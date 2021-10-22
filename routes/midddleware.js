const jwt = require("jwt-simple");
const config = require("./../config/config.js");
const moment = require("moment");
const constants = require("../model/constants");
const User = require("../model/schema/User");

exports.ensureAuthenticated = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: "There is no authorization headers" });
  }
  const token = req.headers.authorization.split(" ")[1];
  try {
    const payload = jwt.decode(token, config.TOKEN_SECRET);
    if (!payload.exp || payload.exp <= moment().unix()) {
      return res.status(401).send({ message: "invalid token" });
    }
    res.locals.subject = payload.sub;
    next();
  } catch (e) {
    // Expired token
    return res.status(401).send({ message: e.message });
  }
};

exports.ensureAdminRole = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: res.locals.subject, roles: { $in: [constants.ADMIN_ROLE] } });
    if (!user) {
      return res.status(401).send({ message: "User is not allowed to perform the action." });
    }
    next();
  } catch (e) {
    return res.status(401).send({ message: e.message });
  }
};

exports.errorHandler = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
};
