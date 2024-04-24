const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const login = require("../handlers/app_api/login");
const update_password = require("../handlers/app_api/update_password");
const login_with_social_media = require("../handlers/app_api/login_with_social_media");

router.post("/login", login);

router.put("/update_password", auth, update_password);

router.put("/login_with_social_media", login_with_social_media);

module.exports = router;
