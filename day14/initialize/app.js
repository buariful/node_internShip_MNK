var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const Model_builder = require("./../Model_builder");
const Controller_builder = require("./../Controller_builder");
const fs = require("fs");

try {
  (async function () {
    async function create_model_routes() {
      Model_builder().build();
      Controller_builder().build();
    }

    await create_model_routes();
  })();
} catch (error) {
  console.log(error);
}
const db = require("./config/database");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

app.set("db", db);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

try {
  (async function () {
    // Dynamically import route modules from the release/routes directory
    const routesPath = path.join(__dirname, "./../release", "routes");
    if (fs.existsSync(routesPath)) {
      fs.readdirSync(routesPath)
        .filter((file) => file.endsWith(".js") && file !== "index.js") // Exclude index.js if it exists
        .forEach((file) => {
          const route = require(path.join(routesPath, file))(express);
          app.use("/v1/api", route); // Mount the route on the Express app
        });
    }
  })();
} catch (error) {
  console.error("Error initializing the application:", error);
}

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
