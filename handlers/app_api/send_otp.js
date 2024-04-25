const { User } = require("../../models/user");
const { validateSendOTP } = require("../../utils/app_api_validations");
const {
  CATCH_BAD_REQUEST,
  SEND_EMAIL_FROM_POSTMARK,
} = require("../../utils/utils");

const send_otp = async (req, res) => {
  try {
    // console.log("req.body: ", req.body);
    const { error } = validateSendOTP(req.body);
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

    const code = Math.floor(Math.random() * 9000) + 1000;

    user.verification_code = code;
    await user.save();

    let subject = "Verification Code";
    let email_body = `Hi! Your verification code is ${code}`;
    await SEND_EMAIL_FROM_POSTMARK(user.email, subject, email_body);

    res.status(200).json({
      code: 200,
      message: "OTP sent successfully",
    });
  } catch (ex) {
    CATCH_BAD_REQUEST(res, ex);
  }
};

module.exports = send_otp;
