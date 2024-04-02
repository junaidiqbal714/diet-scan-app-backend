const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/user");
const { CATCH_BAD_REQUEST } = require("../../utils/utils");
const { validateUpdatePassword } = require("../../utils/app_api_validations");

const update_password = async (req, res) => {
  try {
    // console.log("req.body: ", req.body);
    const { error } = validateUpdatePassword(req.body);
    if (error)
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/\"/g, ""),
      });

    let user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(400).json({ code: 400, message: "Invalid user" });
    }

    const verify_pass = await bcrypt.compare(
      req.body.old_password.trim(),
      user.password
    );

    if (!verify_pass) {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid old password" });
    }

    if (req.body.new_password.trim() != req.body.confirm_password.trim()) {
      return res.status(400).json({
        code: 400,
        message: "New password does not match with confirm password",
      });
    }

    let new_password = req.body.new_password.trim();
    const salt = await bcrypt.genSalt(10);
    new_password = await bcrypt.hash(new_password, salt);

    user.password = new_password;
    user = await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      code: 200,
      message: "Password updated successfully",
      token,
    });
  } catch (ex) {
    CATCH_BAD_REQUEST(res, ex);
  }
};

module.exports = update_password;
