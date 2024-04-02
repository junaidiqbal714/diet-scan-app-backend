const Joi = require("joi");
const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const _ = require("lodash");

const weightSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  weight: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

weightSchema.plugin(timestamps);

weightSchema.methods.toJSON = function () {
  const weight = this;
  const weightObject = weight.toObject();
  const weightJson = _.pick(weightObject, [
    "_id",
    "user_id",
    "weight",
    "date",
    "createdAt",
    "updatedAt",
  ]);
  return weightJson;
};

function validateWeight(body) {
  const schema = { weight: Joi.number().required() };

  return Joi.validate(body, schema);
}

const Weight = mongoose.model("weight", weightSchema);
exports.Weight = Weight;
exports.validateWeight = validateWeight;
