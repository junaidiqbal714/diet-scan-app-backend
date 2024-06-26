const Joi = require("joi");

function validateLogin(body) {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  };

  return Joi.validate(body, schema);
}

function validateUpdatePassword(body) {
  const schema = {
    old_password: Joi.string().required(),
    new_password: Joi.string().min(5).max(255).required(),
    confirm_password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(body, schema);
}

function validateSocialLogin(body) {
  const schema = {
    id_token: Joi.string().required(),
    signup_platform: Joi.string().required().valid("google", "apple"),
  };

  return Joi.validate(body, schema);
}

function validateSendOTP(body) {
  const schema = {
    email: Joi.string().required().email({ minDomainAtoms: 2 }),
  };

  return Joi.validate(body, schema);
}

function validateCodeVerification(body) {
  const schema = {
    email: Joi.string().required().email({ minDomainAtoms: 2 }).trim(),
    verification_code: Joi.string().required().min(6),
  };
  return Joi.validate(body, schema);
}
function validateResetPassword(body) {
  const schema = {
    email: Joi.string().required().email({ minDomainAtoms: 2 }).trim(),
    new_password: Joi.string().required().min(5),
    confirm_password: Joi.string().required().min(5),
  };
  return Joi.validate(body, schema);
}

exports.validateLogin = validateLogin;
exports.validateUpdatePassword = validateUpdatePassword;
exports.validateSocialLogin = validateSocialLogin;
exports.validateSendOTP = validateSendOTP;
exports.validateCodeVerification = validateCodeVerification;
exports.validateResetPassword = validateResetPassword;
