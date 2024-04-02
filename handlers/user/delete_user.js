const { User } = require("../../models/user");
const {
  CATCH_BAD_REQUEST,
  DELETE_FILES_FROM_S3,
} = require("../../utils/utils");

const delete_user = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res
        .status(400)
        .json({ code: 400, message: "Unable to fetch details" });
    }

    let deleted_user = await User.findOneAndDelete({ _id: req.user._id });
    if (!deleted_user) {
      return res
        .status(400)
        .json({ code: 400, message: "Unable to delete this account" });
    }

    DELETE_FILES_FROM_S3(user.profile_pic);

    res.status(200).json({
      code: 200,
      message: "Account deleted successfully",
    });
  } catch (ex) {
    CATCH_BAD_REQUEST(res, ex);
  }
};

module.exports = delete_user;
