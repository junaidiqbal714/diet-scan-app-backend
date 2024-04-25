const { User } = require("../../models/user");
const { validateCodeVerification } = require("../../utils/app_api_validations");
const { CATCH_BAD_REQUEST } = require("../../utils/utils");

const otp_verification = async (req, res) => {
  try {
    // console.log("req.body: ", req.body);
    const { error } = validateCodeVerification(req.body);
    if (error)
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/\"/g, ""),
      });

    const user = await User.findOne({
      email: req.body.email.trim().toLowerCase(),
    });
    if (!user) {
      return res.status(400).json({ code: 400, message: "Invalid email" });
    }

    if (user.verification_code == req.body.verification_code) {
      user.verification_code = "";
      user.verification_status = true;
      await user.save();
    } else {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid verification code" });
    }

    res.status(200).json({
      code: 200,
      message: "OTP verified successfully",
    });
  } catch (ex) {
    CATCH_BAD_REQUEST(res, ex);
  }
};

module.exports = otp_verification;
