const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const signup_user = require("../handlers/user/signup_user");
const profile = require("../handlers/user/profile");
const update_profile = require("../handlers/user/update_profile");
const delete_user = require("../handlers/user/delete_user");

router.post("/signup_user", signup_user);

router.get("/profile", [auth], profile);

router.put("/update_profile", [auth], update_profile);

router.delete("/delete_user", [auth], delete_user);

module.exports = router;
