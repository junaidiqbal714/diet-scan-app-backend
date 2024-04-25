const Joi = require("joi");
const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const _ = require("lodash");

const userSchema = new mongoose.Schema({
  user_name: { type: String, trim: true, unique: true },
  email: { type: String, required: true },
  password: { type: String },
  name: { type: String, trim: true },
  profile_pic: { type: String, default: "", trim: true },
  date_of_birth: { type: Date, default: null },
  gender: { type: String, default: "", trim: true },
  height: { type: Number, default: null },
  // height_unit: { type: String, enum: ["ft", "in"], default: "ft" },
  allergies: { type: String, default: "", trim: true },
  avoid_ingredients: { type: String, default: "", trim: true },
  target_calories: { type: Number, default: null },
  signup_platform: {
    type: String,
    enum: ["google", "apple", "manual"],
    default: "manual",
    trim: true,
  },
  verification_code: { type: String, trim: true, default: "" },
  verification_status: { type: Boolean, default: false },
});

userSchema.plugin(timestamps);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  let userJson = _.pick(userObject, [
    "_id",
    "user_name",
    "email",
    "name",
    "profile_pic",
    "date_of_birth",
    "gender",
    "height",
    // "height_unit",
    "allergies",
    "avoid_ingredients",
    "target_calories",
    "createdAt",
    "updatedAt",
  ]);

  return userJson;
};

function validateUser(body) {
  const schema = {
    user_name: Joi.string().required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    confirm_password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(body, schema);
}

function validateEditUser(body) {
  const schema = {
    gender: Joi.string(),
    date_of_birth: Joi.string(),
    height: Joi.string(),
    // height_unit: Joi.string().valid("ft", "in"),
    allergies: Joi.string(),
    avoid_ingredients: Joi.string(),
    target_calories: Joi.number(),
    image: Joi.string().allow(null, ""),
  };

  return Joi.validate(body, schema);
}

const User = mongoose.model("user", userSchema);
exports.User = User;
exports.validateUser = validateUser;
exports.validateEditUser = validateEditUser;
