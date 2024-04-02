const config = require("config");

module.exports = function () {
  if (!process.env.JWT_SECRET) {
    throw new Error("FATAL ERROR: JWT Key is not defined");
  }
};
