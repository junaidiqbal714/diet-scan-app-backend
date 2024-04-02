const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/user");
const { validateLogin } = require("../../utils/app_api_validations");
const { CATCH_BAD_REQUEST } = require("../../utils/utils");

const login = async (req, res) => {
  try {
    // console.log("req.body: ", req.body);
    const { error } = validateLogin(req.body);
    if (error)
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/\"/g, ""),
      });

    const user = await User.findOne({ email: req.body.email.trim() });
    if (!user) {
      return res.status(400).json({ code: 400, message: "Invalid email" });
    }

    const verify_pass = await bcrypt.compare(
      req.body.password.trim(),
      user.password
    );

    if (!verify_pass) {
      return res.status(400).json({ code: 400, message: "Invalid password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      code: 200,
      message: "Login successful",
      user,
      token,
    });
  } catch (ex) {
    CATCH_BAD_REQUEST(res, ex);
  }
};

module.exports = login;
