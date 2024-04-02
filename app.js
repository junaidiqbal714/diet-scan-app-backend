const winston = require("winston");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const config = require("config");
const app = express();
const http = require("http");
const server = http.createServer(app);

require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || config.get("port");
// server = app.listen(port, () => {
//   console.log(`Server is listening on port: ${port}`);
//   // winston.info(`Server is listening on port: ${port}`);
// });

server.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
  // winston.info(`Server is listening on port: ${port}`);
});

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

module.exports = server;
