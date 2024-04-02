const { User, validateEditUser } = require("../../models/user");
const { IMAGE_EXTENSIONS, USER_FILE_PATH } = require("../../utils/constants");
const {
  CATCH_BAD_REQUEST,
  UPLOAD_FILE_ON_S3,
  DELETE_FILES_FROM_S3,
} = require("../../utils/utils");
const path = require("path");
const _ = require("lodash");

const update_profile = async (req, res) => {
  try {
    // console.log("req.body: ", req.body);
    const { error } = validateEditUser(req.body);
    if (error)
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/\"/g, ""),
      });

    let user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res
        .status(400)
        .json({ code: 400, message: "Unable to fetch details" });
    }

    if (req.files && req.files?.image) {
      let file_extension = path.extname(req.files.image.name);
      let file_extension_status = IMAGE_EXTENSIONS.some(
        (extension) => file_extension.toLowerCase() == extension
      );
      if (!file_extension_status) {
        return res.status(400).json({
          code: 400,
          message:
            "This image type is not allowed. The allowed image types are " +
            IMAGE_EXTENSIONS,
        });
      }

      let profile_pic = await UPLOAD_FILE_ON_S3(
        req.files.image,
        USER_FILE_PATH,
        file_extension
      );

      DELETE_FILES_FROM_S3(user.profile_pic);

      user.profile_pic = profile_pic;
    }

    if (!_.isEmpty(req.body.email)) {
      let user_exists = await User.findOne({
        _id: { $ne: user._id },
        email: req.body.email.trim(),
      });
      if (user_exists) {
        return res
          .status(400)
          .json({ code: 400, message: "Email already exists" });
      }

      let username_exists = await User.findOne({
        _id: { $ne: user._id },
        user_name: req.body.user_name.trim(),
      });
      if (username_exists) {
        return res.status(400).json({
          code: 400,
          message: "This username already exists. change your username",
        });
      }

      user.user_name = req.body.user_name.trim();
      user.email = req.body.email.trim();
    }

    // user.name = req.body.name;
    user.gender = req.body.gender;
    user.date_of_birth = new Date(req.body.date_of_birth);
    user.height = req.body.height;
    user.height_unit = req.body.height_unit;
    user.allergies = req.body.allergies;
    user.avoid_ingredients = req.body.avoid_ingredients;
    user.target_calories = req.body.target_calories;

    user = await user.save();

    res.status(200).json({
      code: 200,
      message: "Profile updated successfully",
      user,
    });
  } catch (ex) {
    CATCH_BAD_REQUEST(res, ex);
  }
};

module.exports = update_profile;
