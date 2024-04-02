const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, validateUser } = require("../../models/user");
const { CATCH_BAD_REQUEST } = require("../../utils/utils");

const signup_user = async (req, res) => {
  try {
    // console.log("req.body: ", req.body);
    const { error } = validateUser(req.body);
    if (error)
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/\"/g, ""),
      });

    const email_exists = await User.findOne({ email: req.body.email.trim() });
    if (email_exists) {
      return res.status(400).json({
        code: 400,
        message: "User with same email already exists",
      });
    }

    const username_exists = await User.findOne({
      user_name: req.body.user_name.trim(),
    });
    if (username_exists) {
      return res.status(400).json({
        code: 400,
        message: "This username already exists. change your username",
      });
    }

    if (req.body.password.trim() != req.body.confirm_password.trim()) {
      return res.status(400).json({
        code: 400,
        message: "Password does not match with confirm password",
      });
    }

    let password = req.body.password.trim();
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    let user = new User({
      user_name: req.body.user_name.trim(),
      email: req.body.email,
      password,
    });
    user = await user.save();

    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "Unable to create your account",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      code: 200,
      message: "Account created successfully",
      user,
      token,
    });
  } catch (ex) {
    CATCH_BAD_REQUEST(res, ex);
  }
};

module.exports = signup_user;
