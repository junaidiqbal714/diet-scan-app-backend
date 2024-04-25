const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/user");
const { CATCH_BAD_REQUEST } = require("../../utils/utils");
const { validateResetPassword } = require("../../utils/app_api_validations");

const reset_password = async (req, res) => {
  try {
    // console.log("req.body: ", req.body);
    const { error } = validateResetPassword(req.body);
    if (error)
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/\"/g, ""),
      });

    let user = await User.findOne({
      email: req.body.email.trim().toLowerCase(),
    });
    if (!user) {
      return res.status(400).json({ code: 400, message: "Invalid email" });
    }

    if (req.body.new_password.trim() != req.body.confirm_password.trim()) {
      return res.status(400).json({
        code: 400,
        message: "New password does not match with confirm password",
      });
    }

    if (!user.verification_status) {
      return res
        .status(400)
        .json({ code: 400, message: "Unable to reset password at this time" });
    }

    let new_password = req.body.new_password.trim();
    const salt = await bcrypt.genSalt(10);
    new_password = await bcrypt.hash(new_password, salt);

    user.password = new_password;
    user.verification_status = false;
    user = await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      code: 200,
      message: "Password reset successfully",
      user,
      token,
    });
  } catch (ex) {
    CATCH_BAD_REQUEST(res, ex);
  }
};

module.exports = reset_password;
