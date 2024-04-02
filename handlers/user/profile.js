const { User } = require("../../models/user");
const { CATCH_BAD_REQUEST } = require("../../utils/utils");

const profile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "Unable to fetch your profile details",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Profile details fetched successfully",
      user,
    });
  } catch (ex) {
    CATCH_BAD_REQUEST(res, ex);
  }
};

module.exports = profile;
