const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const db = process.env.MONGODB_URI;
  mongoose.connect(db).then(() => {
    console.log(`Successfully connected to ${db}`);
    // winston.info(`Connected to ${db}...`);
  });
};
