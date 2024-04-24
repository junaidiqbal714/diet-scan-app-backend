const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const appleSignin = require("apple-signin-auth");
const { User } = require("../../models/user");
const { validateSocialLogin } = require("../../utils/app_api_validations");
const { CATCH_BAD_REQUEST } = require("../../utils/utils");

const login = async (req, res) => {
  try {
    // console.log("req.body: ", req.body);
    const { error } = validateSocialLogin(req.body);
    if (error)
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/\"/g, ""),
      });

    if (req.body.signup_platform === "google") {
      let first_name = "";
      let last_name = "";
      let email = "";
      let name = "";
      // let profile_image = "";
      await axios({
        method: "get",
        url: `https://oauth2.googleapis.com/tokeninfo?id_token=${req.body.id_token}`,
        withCredentials: true,
      })
        .then(function (resp) {
          console.log("resp: ", resp);
          first_name = resp.data.given_name;
          last_name = resp.data.family_name;
          email = resp.data.email;
          name = first_name + " " + last_name;
          // profile_image = resp.data.picture;
        })
        .catch(function (error) {
          console.log("error: ", error);
          return res.status(400).json({
            code: 400,
            message:
              "Unable to verify token. Check logs on server for more information",
          });
        });

      let user_exists = await User.findOne({ email });
      if (user_exists) {
        const token = jwt.sign(
          { _id: user_exists._id },
          process.env.JWT_SECRET
        );
        if (!token) {
          return res
            .status(400)
            .json({ code: 400, message: "Unable to log in. Try again later" });
        }

        return res.status(200).json({
          code: 200,
          message: "Successfully logged in with Google account",
          user: user_exists,
          token,
        });
      } else {
        let new_user = new User({ email, name, signup_platform: "google" });
        new_user = await new_user.save();

        if (!new_user) {
          return res.status(400).json({
            code: 400,
            message: "Unable to create your account",
          });
        }

        const token = jwt.sign({ _id: new_user._id }, process.env.JWT_SECRET);
        if (!token) {
          return res
            .status(400)
            .json({ code: 400, message: "Unable to log in. Try again later" });
        }

        return res.status(200).json({
          code: 200,
          message: "Successfully signed up with Google account",
          user: new_user,
          token,
        });
      }
    } else if (req.body.signup_platform === "apple") {
      let email = "";
      const apple_resp = await appleSignin
        .verifyIdToken(req.body.id_token, {
          // Add more validations if needed
        })
        .then(function (resp) {
          console.log("resp: ", resp);
          email = resp.email;
        })
        .catch(function (error) {
          console.log("error: ", error);
          return res.status(400).json({
            code: 400,
            message:
              "Unable to verify token. Check logs on server for more information",
          });
        });

      let user_exists = await User.findOne({ email });

      if (user_exists) {
        const token = jwt.sign(
          { _id: user_exists._id },
          process.env.JWT_SECRET
        );
        if (!token) {
          return res
            .status(400)
            .json({ code: 400, message: "Unable to log in. Try again later" });
        }

        return res.status(200).json({
          code: 200,
          message: "Successfully logged in with Apple account",
          user: user_exists,
          token,
        });
      } else {
        let new_user = new User({ email, signup_platform: "apple" });
        new_user = await new_user.save();

        if (!new_user) {
          return res.status(400).json({
            code: 400,
            message: "Unable to create your account",
          });
        }

        const token = jwt.sign({ _id: new_user._id }, process.env.JWT_SECRET);
        if (!token) {
          return res
            .status(400)
            .json({ code: 400, message: "Unable to log in. Try again later" });
        }

        return res.status(200).json({
          code: 200,
          message: "Successfully signed up with Apple account",
          user: new_user,
          token,
        });
      }
    } else {
      return res.status(400).json({ code: 400, message: "Invalid platform" });
    }
  } catch (ex) {
    CATCH_BAD_REQUEST(res, ex);
  }
};

module.exports = login;
