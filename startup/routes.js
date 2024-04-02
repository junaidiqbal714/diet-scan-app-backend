const express = require("express");
const app_api = require("../routes/app_api");
const user = require("../routes/user");
const weight = require("../routes/weight");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/app_api", app_api);
  app.use("/api/user", user);
  app.use("/api/weight", weight);
  app.use(error);
};
