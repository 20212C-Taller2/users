var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
const login = require("./routes/login");
const register = require("./routes/register");
const users = require("./routes/users");
const middleware = require("./routes/midddleware");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.js");
const swaggerOptions = {
  explorer: false,
  swaggerOptions: {
    validatorUrl: null,
  },
};

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
let handleCorsHeaders = function (req, res, next) {
  if (req.get("Origin") != null) {
    res.header("Access-Control-Allow-Origin", req.get("Origin"));
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.get("Access-Control-Request-Method")) {
      res.header("Access-Control-Allow-Methods", req.get("Access-Control-Request-Method"));
    }
    if (req.get("Access-Control-Request-Headers")) {
      res.header("Access-Control-Allow-Headers", req.get("Access-Control-Request-Headers"));
    }
    if (req.method === "OPTIONS") {
      res.status(200).send();
    } else {
      next();
    }
  } else {
    next();
  }
};

app.use(handleCorsHeaders);

app.use("/", indexRouter);
app.route("/login").post(login.loginUser);
app.route("/login/admin").post(login.loginAdmin);
app.route("/login/google").post(login.loginGoogle);
app.route("/register").post(register.registerUser);
app.route("/register/admin").post(register.registerAdmin);
app.route("/users").get(middleware.ensureAuthenticated, users.getUsers);
app.route("/users").post(middleware.ensureAuthenticated, users.getUsersByIds);
app.route("/users/blocked").get(middleware.ensureAuthenticated, users.isBlockedUser);
app.route("/users/:id").patch(middleware.ensureAuthenticated, users.updateUser);
app.route("/users/:id").get(middleware.ensureAuthenticated, users.getUser);
app.route("/users/:id/block").post(middleware.ensureAuthenticated, middleware.ensureAdminRole, users.blockUser);
app.route("/users/:id/block").delete(middleware.ensureAuthenticated, middleware.ensureAdminRole, users.unblockUser);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
