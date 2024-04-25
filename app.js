// const winston = require("winston");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
// const config = require("config");
const app = express();
// const http = require("http");
// const server = http.createServer(app);

// console.log("Starting app...");

require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

// const port = process.env.PORT || config.get("port");

// server.listen(port, () => {
//   console.log(`Server is listening on port: ${port}`);
// });

app.use(logger("dev"));
app.use(
  logger("common", {
    stream: fs.createWriteStream(path.join(__dirname, "logFile.log"), {
      flags: "a",
    }),
  })
);

app.use(bodyParser.json({ limit: "100mb" }));
app.use(
  bodyParser.urlencoded({ extended: false, limit: "2mb", parameterLimit: 1000 })
);
app.use(fileUpload());

require("./startup/routes")(app);

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
