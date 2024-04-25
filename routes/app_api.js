const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const login = require("../handlers/app_api/login");
const update_password = require("../handlers/app_api/update_password");
const login_with_social_media = require("../handlers/app_api/login_with_social_media");
const send_otp = require("../handlers/app_api/send_otp");
const otp_verification = require("../handlers/app_api/otp_verification");
const reset_password = require("../handlers/app_api/reset_password");

router.post("/login", login);

router.put("/update_password", auth, update_password);

router.post("/login_with_social_media", login_with_social_media);

router.post("/send_otp", send_otp);

router.post("/otp_verification", otp_verification);

router.post("/reset_password", reset_password);

module.exports = router;
