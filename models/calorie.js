const Joi = require("joi");
const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const _ = require("lodash");

const calorieSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  food: { type: String, default: "" },
  calories: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

calorieSchema.plugin(timestamps);

calorieSchema.methods.toJSON = function () {
  const calorie = this;
  const calorieObject = calorie.toObject();
  const calorieJson = _.pick(calorieObject, [
    "_id",
    "user_id",
    "food",
    "calories",
    "date",
    "createdAt",
    "updatedAt",
  ]);
  return calorieJson;
};

function validateCalories(body) {
  const schema = {
    food_calories: Joi.array()
      .items(
        Joi.object({
          food: Joi.string().required(),
          calories: Joi.number().required().min(0),
        })
      )
      .required(),
  };

  return Joi.validate(body, schema);
}

const Calorie = mongoose.model("calorie", calorieSchema);
exports.Calorie = Calorie;
exports.validateCalories = validateCalories;
