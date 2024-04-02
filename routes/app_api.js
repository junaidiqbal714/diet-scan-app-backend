const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const login = require("../handlers/app_api/login");
const update_password = require("../handlers/app_api/update_password");

router.post("/login", login);

router.put("/update_password", auth, update_password);

module.exports = router;
